package exerciseset

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

func (r *repo) Create(ctx context.Context, createDto *CreateExerciseSetDto) (*ExerciseSet, error) {
	stmt := `
		INSERT INTO exercise_set (
			wsession_id,
			exercise_id,
			step_number,
			weight,
			repetitions,
			rir
		)
		VALUES (
			@wsessionId,
			@exerciseId,
			@stepNumber,
			@weight,
			@repetitions,
			@rir
		)
		RETURNING *
	`

	args := pgx.NamedArgs{
		"wsessionId":  createDto.WsessionId,
		"exerciseId":  createDto.ExerciseId,
		"stepNumber":  createDto.StepNumber,
		"weight":      createDto.Weight,
		"repetitions": createDto.Repetitions,
	}

	if createDto.Rir != nil {
		args["rir"] = *createDto.Rir
	} else {
		args["rir"] = 3
	}

	rows, err := r.pool.Query(ctx, stmt, args)
	if err != nil {
		return nil, fmt.Errorf("error inserting exercise set: %w", err)
	}

	set, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[ExerciseSet])
	if err != nil {
		return nil, fmt.Errorf("error collecting row from exercise_set: %w", err)
	}

	return &set, nil
}

func (r *repo) GetAll(ctx context.Context, filters Filters, limit, offset int) ([]ExerciseSet, error) {
	args := pgx.NamedArgs{}
	conditions := []string{}

	if filters.WsessionId != 0 {
		conditions = append(conditions, "wsession_id = @wsessionId")
		args["wsessionId"] = filters.WsessionId
	}

	if filters.ExerciseId != 0 {
		conditions = append(conditions, "exercise_id = @exerciseId")
		args["exerciseId"] = filters.ExerciseId
	}

	stmt := `SELECT * FROM exercise_set`

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
		return nil, fmt.Errorf("error executing GetAll sets query: %w", err)
	}

	sets, err := pgx.CollectRows(rows, pgx.RowToStructByName[ExerciseSet])
	if err != nil {
		return nil, fmt.Errorf("error collecting exercise sets: %w", err)
	}

	return sets, nil
}

func (r *repo) GetById(ctx context.Context, id int) (*ExerciseSet, error) {
	stmt := `
		SELECT * FROM exercise_set
		WHERE id = @id
	`

	rows, err := r.pool.Query(ctx, stmt, pgx.NamedArgs{"id": id})
	if err != nil {
		return nil, fmt.Errorf("error executing GetById set query: %w", err)
	}

	set, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[ExerciseSet])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("%w", ErrNotFound)
		}
		return nil, fmt.Errorf("error getting exercise set: %w", err)
	}

	return &set, nil
}

func (r *repo) Update(ctx context.Context, id int, updateDto *UpdateExerciseSetDto) (*ExerciseSet, error) {
	stmt := `
		UPDATE exercise_set
		SET 
	`
	columns := []string{}
	args := pgx.NamedArgs{}

	if updateDto.Weight != nil {
		columns = append(columns, "weight=@weight")
		args["weight"] = *updateDto.Weight
	}

	if updateDto.Repetitions != nil {
		columns = append(columns, "repetitions=@repetitions")
		args["repetitions"] = *updateDto.Repetitions
	}

	if updateDto.Rir != nil {
		columns = append(columns, "rir=@rir")
		args["rir"] = *updateDto.Rir
	}

	if updateDto.StepNumber != nil {
		columns = append(columns, "step_number=@stepNumber")
		args["stepNumber"] = *updateDto.StepNumber
	}

	stmt += strings.Join(columns, ",")
	stmt += " WHERE id=@id RETURNING *"
	args["id"] = id

	rows, err := r.pool.Query(ctx, stmt, args)
	if err != nil {
		return nil, fmt.Errorf("error executing Update set query: %w", err)
	}

	updatedSet, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[ExerciseSet])
	if err != nil {
		return nil, fmt.Errorf("error updating exercise set: %w", err)
	}

	return &updatedSet, nil
}

func (r *repo) Count(ctx context.Context, filters Filters) (int, error) {
	args := pgx.NamedArgs{}
	conditions := []string{}

	if filters.WsessionId != 0 {
		conditions = append(conditions, "wsession_id = @wsessionId")
		args["wsessionId"] = filters.WsessionId
	}

	if filters.ExerciseId != 0 {
		conditions = append(conditions, "exercise_id = @exerciseId")
		args["exerciseId"] = filters.ExerciseId
	}

	stmt := `SELECT COUNT(*) FROM exercise_set`

	if len(conditions) > 0 {
		stmt += ` WHERE ` + strings.Join(conditions, " AND ")
	}

	var count int
	err := r.pool.QueryRow(ctx, stmt, args).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("error counting exercise sets: %w", err)
	}

	return count, nil
}
