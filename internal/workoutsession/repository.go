package workoutsession

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

func (r *repo) Create(ctx context.Context, createDto *CreateWorkoutSessionDto) (*WorkoutSession, error) {
	stmt := `
		INSERT INTO workout_session (
			user_id,
			observations
		)
		VALUES (
			@userId,
			@observations
		)
		RETURNING *
	`

	rows, err := r.pool.Query(ctx, stmt, pgx.NamedArgs{
		"userId":       createDto.UserId,
		"observations": createDto.Observations,
	})
	if err != nil {
		return nil, fmt.Errorf("error inserting workout session: %w", err)
	}

	session, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[WorkoutSession])
	if err != nil {
		return nil, fmt.Errorf("error collecting row from workout_session: %w", err)
	}

	return &session, nil
}

func (r *repo) GetAll(ctx context.Context, filters Filters, limit, offset int) ([]WorkoutSession, error) {
	args := pgx.NamedArgs{}
	conditions := []string{}

	if filters.UserId != 0 {
		conditions = append(conditions, "user_id = @userId")
		args["userId"] = filters.UserId
	}

	if filters.Status != "" {
		conditions = append(conditions, "status = @status")
		args["status"] = filters.Status
	}

	stmt := `SELECT * FROM workout_session`

	if len(conditions) > 0 {
		stmt += ` WHERE ` + strings.Join(conditions, " AND ")
	}

	switch filters.Order {
	case 1:
		stmt += " ORDER BY start_time ASC"
	case 0:
		stmt += " ORDER BY start_time DESC"
	default:
		return nil, fmt.Errorf("order type unrecognized")
	}

	stmt += ` LIMIT @lim OFFSET @off`
	args["lim"] = limit
	args["off"] = offset

	rows, err := r.pool.Query(ctx, stmt, args)
	if err != nil {
		return nil, fmt.Errorf("error executing GetAll sessions query: %w", err)
	}

	sessions, err := pgx.CollectRows(rows, pgx.RowToStructByName[WorkoutSession])
	if err != nil {
		return nil, fmt.Errorf("error collecting sessions: %w", err)
	}

	return sessions, nil
}

func (r *repo) GetById(ctx context.Context, id int) (*WorkoutSession, error) {
	stmt := `
		SELECT * FROM workout_session
		WHERE id = @id
	`

	rows, err := r.pool.Query(ctx, stmt, pgx.NamedArgs{"id": id})
	if err != nil {
		return nil, fmt.Errorf("error executing GetById session query: %w", err)
	}

	session, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[WorkoutSession])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("%w", ErrNotFound)
		}
		return nil, fmt.Errorf("error getting session: %w", err)
	}

	return &session, nil
}

func (r *repo) Update(ctx context.Context, id int, updateDto *UpdateWorkoutSessionDto) (*WorkoutSession, error) {
	stmt := `
		UPDATE workout_session
		SET 
	`
	columns := []string{}
	args := pgx.NamedArgs{}

	if updateDto.Status != nil {
		columns = append(columns, "status=@status")
		args["status"] = *updateDto.Status
	}

	if updateDto.EndTime != nil {
		columns = append(columns, "end_time=@endTime")
		args["endTime"] = *updateDto.EndTime
	}

	if updateDto.Observations != nil {
		columns = append(columns, "observations=@observations")
		args["observations"] = *updateDto.Observations
	}

	stmt += strings.Join(columns, ",")
	stmt += " WHERE id=@id RETURNING *"
	args["id"] = id

	rows, err := r.pool.Query(ctx, stmt, args)
	if err != nil {
		return nil, fmt.Errorf("error executing Update session query: %w", err)
	}

	updatedSession, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[WorkoutSession])
	if err != nil {
		return nil, fmt.Errorf("error updating session: %w", err)
	}

	return &updatedSession, nil
}

func (r *repo) Count(ctx context.Context, filters Filters) (int, error) {
	args := pgx.NamedArgs{}
	conditions := []string{}

	if filters.UserId != 0 {
		conditions = append(conditions, "user_id = @userId")
		args["userId"] = filters.UserId
	}

	if filters.Status != "" {
		conditions = append(conditions, "status = @status")
		args["status"] = filters.Status
	}

	stmt := `SELECT COUNT(*) FROM workout_session`

	if len(conditions) > 0 {
		stmt += ` WHERE ` + strings.Join(conditions, " AND ")
	}

	var count int
	err := r.pool.QueryRow(ctx, stmt, args).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("error counting sessions: %w", err)
	}

	return count, nil
}
