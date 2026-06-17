package user

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

func (r *repo) Create(ctx context.Context, createUserDto *CreateUserDto) (*User, error) {
	stmt := `
		INSERT INTO "user" (
			name,
			last_name,
			email,
			password
		)
		VALUES (
			@name,
			@lastName,
			@email,
			@password
		)
		RETURNING *
	`

	rows, err := r.pool.Query(ctx, stmt, pgx.NamedArgs{
		"name":     createUserDto.Name,
		"lastName": createUserDto.LastName,
		"email":    createUserDto.Email,
		"password": createUserDto.Password,
	})
	if err != nil {
		return nil, fmt.Errorf("error inserting user: %w", err)
	}

	user, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[User])
	if err != nil {
		return nil, fmt.Errorf("error collecting row from table user: %w", err)
	}

	return &user, nil
}

func (r *repo) GetAll(ctx context.Context, filters Filters, limit, offset int) ([]User, error) {
	args := pgx.NamedArgs{}
	conditions := []string{}

	if filters.Name != "" {
		conditions = append(conditions, `name ILIKE @name`)
		args["name"] = "%" + filters.Name + "%"
	}

	if filters.LastName != "" {
		conditions = append(conditions, `last_name ILIKE @lastName`)
		args["lastName"] = "%" + filters.LastName + "%"
	}

	if filters.Email != "" {
		conditions = append(conditions, `email ILIKE @email`)
		args["email"] = "%" + filters.Email + "%"
	}

	stmt := `SELECT * FROM "user"`

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
		return nil, fmt.Errorf("error executing GetAll users query: %w", err)
	}

	users, err := pgx.CollectRows(rows, pgx.RowToStructByName[User])
	if err != nil {
		return nil, fmt.Errorf("error collecting users: %w", err)
	}

	return users, nil
}

func (r *repo) GetById(ctx context.Context, id int) (*User, error) {
	stmt := `
		SELECT * FROM "user"
		WHERE id = @id
	`

	rows, err := r.pool.Query(ctx, stmt, pgx.NamedArgs{"id": id})
	if err != nil {
		return nil, fmt.Errorf("error executing GetById user query: %w", err)
	}

	user, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[User])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("%w", ErrNotFound)
		}
		return nil, fmt.Errorf("error getting user: %w", err)
	}

	return &user, nil
}

func (r *repo) Update(ctx context.Context, id int, updateUserDto *UpdateUserDto) (*User, error) {
	stmt := `
		UPDATE "user"
		SET 
	`
	columns := []string{}
	args := pgx.NamedArgs{}

	if updateUserDto.Name != nil {
		columns = append(columns, "name=@name")
		args["name"] = *updateUserDto.Name
	}

	if updateUserDto.LastName != nil {
		columns = append(columns, "last_name=@lastName")
		args["lastName"] = *updateUserDto.LastName
	}

	if updateUserDto.Email != nil {
		columns = append(columns, "email=@email")
		args["email"] = *updateUserDto.Email
	}

	if updateUserDto.Password != nil {
		columns = append(columns, "password=@password")
		args["password"] = *updateUserDto.Password
	}

	stmt += strings.Join(columns, ",")
	stmt += " WHERE id=@id RETURNING *"
	args["id"] = id

	rows, err := r.pool.Query(ctx, stmt, args)
	if err != nil {
		return nil, fmt.Errorf("error executing Update user query: %w", err)
	}

	updatedUser, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[User])
	if err != nil {
		return nil, fmt.Errorf("error updating user: %w", err)
	}

	return &updatedUser, nil
}

func (r *repo) Count(ctx context.Context, filters Filters) (int, error) {
	args := pgx.NamedArgs{}
	conditions := []string{}

	if filters.Name != "" {
		conditions = append(conditions, `name ILIKE @name`)
		args["name"] = "%" + filters.Name + "%"
	}

	if filters.LastName != "" {
		conditions = append(conditions, `last_name ILIKE @lastName`)
		args["lastName"] = "%" + filters.LastName + "%"
	}

	if filters.Email != "" {
		conditions = append(conditions, `email ILIKE @email`)
		args["email"] = "%" + filters.Email + "%"
	}

	stmt := `SELECT COUNT(*) FROM "user"`

	if len(conditions) > 0 {
		stmt += ` WHERE ` + strings.Join(conditions, " AND ")
	}

	var count int
	err := r.pool.QueryRow(ctx, stmt, args).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("error counting users: %w", err)
	}

	return count, nil
}
