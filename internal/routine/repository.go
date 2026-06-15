package routine

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

func (r *repo) Create(ctx context.Context, createRoutineDto *CreateRoutineDto) (*Routine, error) {
	stmt := `
		INSERT INTO routine (
			name,
			description,
			frequency,
			type
		)
		VALUES (
			@name,
			@description,
			@frequency,
			@type
		)
		RETURNING *
	`

	rows, err := r.pool.Query(ctx, stmt, pgx.NamedArgs{
		"name":        createRoutineDto.Name,
		"description": createRoutineDto.Description,
		"frequency":   createRoutineDto.Frequency,
		"type":        createRoutineDto.RoutineType,
	})
	if err != nil {
		return nil, fmt.Errorf("error inserting routine: %w", err)
	}

	routine, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[Routine])
	if err != nil {
		return nil, fmt.Errorf("error collecting routine row: %w", err)
	}

	return &routine, nil
}

func (r *repo) GetAll(ctx context.Context, filters Filters, limit, offset int) ([]Routine, error) {
	return nil, nil
}

func (r *repo) GetById(ctx context.Context, id int) (*Routine, error) {
	return nil, nil
}
