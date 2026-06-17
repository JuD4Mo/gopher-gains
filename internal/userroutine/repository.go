package userroutine

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

func (r *repo) Create(ctx context.Context, createDto *CreateUserRoutineDto) (*UserRoutine, error) {
	stmt := `
		INSERT INTO user_routine (
			user_id,
			routine_id
		)
		VALUES (
			@userId,
			@routineId
		)
		RETURNING *
	`

	rows, err := r.pool.Query(ctx, stmt, pgx.NamedArgs{
		"userId":    createDto.UserId,
		"routineId": createDto.RoutineId,
	})
	if err != nil {
		return nil, fmt.Errorf("error inserting user routine: %w", err)
	}

	userRoutine, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[UserRoutine])
	if err != nil {
		return nil, fmt.Errorf("error collecting row from user_routine: %w", err)
	}

	return &userRoutine, nil
}

func (r *repo) GetByUserId(ctx context.Context, userId int) ([]UserRoutine, error) {
	stmt := `
		SELECT * FROM user_routine
		WHERE user_id = @userId
	`

	rows, err := r.pool.Query(ctx, stmt, pgx.NamedArgs{"userId": userId})
	if err != nil {
		return nil, fmt.Errorf("error executing GetByUserId query: %w", err)
	}

	routines, err := pgx.CollectRows(rows, pgx.RowToStructByName[UserRoutine])
	if err != nil {
		return nil, fmt.Errorf("error collecting user routines: %w", err)
	}

	return routines, nil
}

func (r *repo) GetByRoutineId(ctx context.Context, routineId int) ([]UserRoutine, error) {
	stmt := `
		SELECT * FROM user_routine
		WHERE routine_id = @routineId
	`

	rows, err := r.pool.Query(ctx, stmt, pgx.NamedArgs{"routineId": routineId})
	if err != nil {
		return nil, fmt.Errorf("error executing GetByRoutineId query: %w", err)
	}

	users, err := pgx.CollectRows(rows, pgx.RowToStructByName[UserRoutine])
	if err != nil {
		return nil, fmt.Errorf("error collecting user routines: %w", err)
	}

	return users, nil
}
