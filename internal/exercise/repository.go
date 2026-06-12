package exercise

import (
	"context"
	"errors"
	"fmt"
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
