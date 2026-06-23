package exercise

import (
	"context"
	"errors"
	"fmt"
	"math"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type repo struct {
	pool *pgxpool.Pool
}

func NewRepository(pool *pgxpool.Pool) Repository {
	return &repo{
		pool: pool,
	}
}

func (r *repo) Create(ctx context.Context, createExerciseDto *CreateExerciseDto) (*Exercise, error) {

	stmt := `
		INSERT INTO exercise (
			name,
			target_muscle_group,
			description,
			execution_tip
		)
		VALUES (
			@name,
			@muscleGroup,
			@description,
			@executionTip
		)
		RETURNING *
	`

	rows, err := r.pool.Query(ctx, stmt, pgx.NamedArgs{
		"name":         createExerciseDto.Name,
		"description":  createExerciseDto.Description,
		"executionTip": createExerciseDto.ExecutionTip,
		"muscleGroup":  createExerciseDto.TargetMuscleGroup,
	})
	if err != nil {
		return nil, fmt.Errorf("error inserting exercise: %w", err)
	}

	exercise, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[Exercise])
	if err != nil {
		return nil, fmt.Errorf("error collecting row from table exercise: %w", err)
	}

	return &exercise, nil
}

func (r *repo) GetAll(ctx context.Context, filters Filters, limit, offset int) ([]Exercise, error) {
	args := pgx.NamedArgs{}
	conditions := []string{}

	if filters.Name != "" {
		conditions = append(conditions, `name ILIKE @name`)
		args["name"] = "%" + filters.Name + "%"
	}

	if filters.MuscleGroup != "" {
		conditions = append(conditions, `target_muscle_group = @muscleGroup`)
		args["muscleGroup"] = filters.MuscleGroup
	}

	stmt := `SELECT * FROM exercise`

	if len(conditions) > 0 {
		stmt += ` WHERE ` + strings.Join(conditions, " AND ")
	}

	switch filters.Order {
	case 1:
		stmt += " ORDER BY created_at ASC"
	case 0:
		stmt += " ORDER BY created_at DESC"
	default:
		return nil, fmt.Errorf("order type unrecognized")
	}

	stmt += ` LIMIT @lim OFFSET @off`
	args["lim"] = limit
	args["off"] = offset

	rows, err := r.pool.Query(ctx, stmt, args)
	if err != nil {
		return nil, fmt.Errorf("error executing GetAll query: %w", err)
	}

	exercises, err := pgx.CollectRows(rows, pgx.RowToStructByName[Exercise])
	if err != nil {
		return nil, fmt.Errorf("error collecting exercises: %w", err)
	}

	return exercises, nil
}

func (r *repo) GetById(ctx context.Context, id int) (*Exercise, error) {
	stmt := `
		SELECT * FROM exercise
		WHERE id = @id
	`
	var exercise Exercise
	rows, err := r.pool.Query(ctx, stmt, pgx.NamedArgs{"id": id})
	if err != nil {
		return nil, fmt.Errorf("error executing GetById query: %w", err)
	}

	exercise, err = pgx.CollectOneRow(rows, pgx.RowToStructByName[Exercise])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("%w", ErrNotFound)
		}
		return nil, fmt.Errorf("error getting exercise: %w", err)
	}

	return &exercise, nil
}

func (r *repo) Update(ctx context.Context, id int, updateExerciseDto *UpdateExerciseDto) (*Exercise, error) {
	stmt := `
		UPDATE exercise
		SET 
	`
	columns := []string{}
	args := pgx.NamedArgs{}

	if updateExerciseDto.Name != nil {
		columns = append(columns, "name=@name")
		args["name"] = *updateExerciseDto.Name
	}

	if updateExerciseDto.Description != nil {
		columns = append(columns, "description=@description")
		args["description"] = *updateExerciseDto.Description
	}

	if updateExerciseDto.ExecutionTip != nil {
		columns = append(columns, "execution_tip=@executionTip")
		args["executionTip"] = *updateExerciseDto.ExecutionTip
	}

	if updateExerciseDto.TargetMuscleGroup != nil {
		columns = append(columns, "target_muscle_group=@targetMuscleGroup")
		args["targetMuscleGroup"] = *updateExerciseDto.TargetMuscleGroup
	}

	stmt += strings.Join(columns, ",")
	stmt += " WHERE id=@id RETURNING *"
	args["id"] = id

	rows, err := r.pool.Query(ctx, stmt, args)
	if err != nil {
		return nil, fmt.Errorf("error executing Update query: %w", err)
	}

	updatedExercise, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[Exercise])
	if err != nil {
		return nil, fmt.Errorf("error updating exercise: %w", err)
	}

	return &updatedExercise, nil
}

func (r *repo) GetExercise1RM(ctx context.Context, exerciseId int) (float64, error) {
	stmt := `
			SELECT ((max_epley + max_brzycki) / 2.0) as onerm FROM 
		(SELECT
				MAX(es.weight * (1 + es.repetitions / 30.0)) AS max_epley,
				MAX(es.weight / (1.0278 - (0.0278 * es.repetitions))) AS max_brzycki
		FROM exercise_set es
		JOIN workout_session ws ON ws.id = es.wsession_id
		WHERE es.exercise_id = @exerciseId
			AND ws.start_time::date = (
					SELECT ws.start_time::date
					FROM workout_session ws
					JOIN exercise_set es ON ws.id = es.wsession_id
					WHERE es.exercise_id = @exerciseId
					ORDER BY ws.start_time DESC
					LIMIT 1
		))
	`
	var oneRM float64
	err := r.pool.QueryRow(ctx, stmt, pgx.NamedArgs{
		"exerciseId": exerciseId,
	}).Scan(&oneRM)
	if err != nil {
		return 0, fmt.Errorf("error executing 1RM: %w", err)
	}

	return math.Round((oneRM * 100)) / 100, nil
}

func (r *repo) Count(ctx context.Context, filters Filters) (int, error) {
	args := pgx.NamedArgs{}
	conditions := []string{}

	if filters.Name != "" {
		conditions = append(conditions, `name ILIKE @name`)
		args["name"] = "%" + filters.Name + "%"
	}

	if filters.MuscleGroup != "" {
		conditions = append(conditions, `target_muscle_group = @muscleGroup`)
		args["muscleGroup"] = filters.MuscleGroup
	}

	stmt := `SELECT COUNT(*) FROM exercise`

	if len(conditions) > 0 {
		stmt += ` WHERE ` + strings.Join(conditions, " AND ")
	}

	var count int
	err := r.pool.QueryRow(ctx, stmt, args).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("error counting exercises: %w", err)
	}

	return count, nil
}
