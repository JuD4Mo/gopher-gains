package exercise

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
		return nil, fmt.Errorf("error inserting exercise: %v", err)
	}

	exercise, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[Exercise])
	if err != nil {
		return nil, fmt.Errorf("error collecting row from table exercise: %v", err)
	}

	return &exercise, nil
}
