package routineexercise

import (
	"context"
	"fmt"

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

func (r *repo) Create(ctx context.Context, createDto *CreateRoutineExerciseDto) (*RoutineExercise, error) {
	stmt := `
		INSERT INTO routine_exercise (
			routine_id,
			exercise_id,
			step_number
		)
		VALUES (
			@routineId,
			@exerciseId,
			@stepNumber
		)
		RETURNING *
	`

	rows, err := r.pool.Query(ctx, stmt, pgx.NamedArgs{
		"routineId":  createDto.RoutineId,
		"exerciseId": createDto.ExerciseId,
		"stepNumber": createDto.StepNumber,
	})
	if err != nil {
		return nil, fmt.Errorf("error inserting routine exercise: %w", err)
	}

	re, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[RoutineExercise])
	if err != nil {
		return nil, fmt.Errorf("error collecting row from routine_exercise: %w", err)
	}

	return &re, nil
}

func (r *repo) GetByRoutineId(ctx context.Context, routineId int) ([]RoutineExercise, error) {
	stmt := `
		SELECT * FROM routine_exercise
		WHERE routine_id = @routineId
		ORDER BY step_number ASC
	`

	rows, err := r.pool.Query(ctx, stmt, pgx.NamedArgs{"routineId": routineId})
	if err != nil {
		return nil, fmt.Errorf("error executing GetByRoutineId query: %w", err)
	}

	exercises, err := pgx.CollectRows(rows, pgx.RowToStructByName[RoutineExercise])
	if err != nil {
		return nil, fmt.Errorf("error collecting routine exercises: %w", err)
	}

	return exercises, nil
}

func (r *repo) UpdateStep(ctx context.Context, routineId, exerciseId int, stepNumber int) (*RoutineExercise, error) {
	stmt := `
		UPDATE routine_exercise
		SET step_number = @stepNumber
		WHERE routine_id = @routineId AND exercise_id = @exerciseId
		RETURNING *
	`

	rows, err := r.pool.Query(ctx, stmt, pgx.NamedArgs{
		"routineId":  routineId,
		"exerciseId": exerciseId,
		"stepNumber": stepNumber,
	})
	if err != nil {
		return nil, fmt.Errorf("error updating routine exercise step: %w", err)
	}

	re, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[RoutineExercise])
	if err != nil {
		return nil, fmt.Errorf("error collecting updated routine exercise: %w", err)
	}

	return &re, nil
}

func (r *repo) Delete(ctx context.Context, routineId, exerciseId int) error {
	stmt := `
		DELETE FROM routine_exercise
		WHERE routine_id = @routineId AND exercise_id = @exerciseId
	`

	_, err := r.pool.Exec(ctx, stmt, pgx.NamedArgs{
		"routineId":  routineId,
		"exerciseId": exerciseId,
	})
	if err != nil {
		return fmt.Errorf("error deleting routine exercise: %w", err)
	}

	return nil
}
