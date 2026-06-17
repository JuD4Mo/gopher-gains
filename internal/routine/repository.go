package routine

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
	stmt := `
	SELECT * FROM routine
	`

	args := pgx.NamedArgs{}
	conditions := []string{}

	if filters.Name != "" {
		conditions = append(conditions, "name ILIKE @name")
		args["name"] = "%" + filters.Name + "%"
	}

	if filters.Frequency != 0 {
		conditions = append(conditions, "frequency = @frequency")
		args["frequency"] = filters.Frequency
	}

	if filters.RoutineType != "" {
		conditions = append(conditions, "type = @routineType")
		args["routineType"] = filters.RoutineType
	}

	if len(conditions) > 0 {
		stmt += " WHERE " + strings.Join(conditions, " AND ")
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
		return nil, fmt.Errorf("error executing getAll routines: %w", err)
	}

	routines, err := pgx.CollectRows(rows, pgx.RowToStructByName[Routine])
	if err != nil {
		return nil, fmt.Errorf("error collecting routines rows: %w", err)
	}

	return routines, nil
}

func (r *repo) GetById(ctx context.Context, id int) (*Routine, error) {
	stmt := `
		SELECT * FROM routine
		WHERE id = @id
	`
	rows, err := r.pool.Query(ctx, stmt, pgx.NamedArgs{
		"id": id,
	})
	if err != nil {
		return nil, fmt.Errorf("error executing routine getById: %w", err)
	}

	routine, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[Routine])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("%w", ErrNotFound)
		}
		return nil, fmt.Errorf("error collecting routine row: %w", err)
	}

	return &routine, nil
}

func (r *repo) Update(ctx context.Context, id int, updateRoutineDto *UpdateRoutineDto) (*Routine, error) {
	stmt := `
		UPDATE routine
		SET 
	`
	columns := []string{}
	args := pgx.NamedArgs{}

	if updateRoutineDto.Name != nil {
		columns = append(columns, "name=@name")
		args["name"] = *updateRoutineDto.Name
	}

	if updateRoutineDto.Description != nil {
		columns = append(columns, "description=@description")
		args["description"] = *updateRoutineDto.Description
	}

	if updateRoutineDto.Frequency != nil {
		columns = append(columns, "frequency=@frequency")
		args["frequency"] = *updateRoutineDto.Frequency
	}

	if updateRoutineDto.RoutineType != nil {
		columns = append(columns, "type=@routineType")
		args["routineType"] = *updateRoutineDto.RoutineType
	}

	stmt += strings.Join(columns, ",")
	stmt += " WHERE id=@id RETURNING *"
	args["id"] = id

	rows, err := r.pool.Query(ctx, stmt, args)
	if err != nil {
		return nil, fmt.Errorf("error executing Update query: %w", err)
	}

	updatedRoutine, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[Routine])
	if err != nil {
		return nil, fmt.Errorf("error updating routine: %w", err)
	}

	return &updatedRoutine, nil
}

func (r *repo) Count(ctx context.Context, filters Filters) (int, error) {
	stmt := `
		SELECT COUNT(*) FROM routine
	`
	args := pgx.NamedArgs{}
	conditions := []string{}

	if filters.Name != "" {
		conditions = append(conditions, "name ILIKE @name")
		args["name"] = "%" + filters.Name + "%"
	}

	if filters.Frequency != 0 {
		conditions = append(conditions, "frequency = @frequency")
		args["frequency"] = filters.Frequency
	}

	if filters.RoutineType != "" {
		conditions = append(conditions, "type = @routineType")
		args["routineType"] = filters.RoutineType
	}
	if len(conditions) > 0 {
		stmt += " WHERE " + strings.Join(conditions, " AND ")
	}

	var numRoutines int
	err := r.pool.QueryRow(ctx, stmt, args).Scan(&numRoutines)
	if err != nil {
		return 0, fmt.Errorf("error counting routines: %w", err)
	}

	return numRoutines, nil
}
