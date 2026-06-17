package user

import "context"

type Repository interface {
	Create(ctx context.Context, createUserDto *CreateUserDto) (*User, error)
	GetAll(ctx context.Context, filters Filters, limit, offset int) ([]User, error)
	GetById(ctx context.Context, id int) (*User, error)
	Update(ctx context.Context, id int, updateUserDto *UpdateUserDto) (*User, error)
	Count(ctx context.Context, filters Filters) (int, error)
}

type Service interface {
	CreateUser(ctx context.Context, createUserDto *CreateUserDto) (*User, error)
	GetAllUsers(ctx context.Context, filters Filters, limit, offset int) ([]User, error)
	GetUserById(ctx context.Context, id int) (*User, error)
	UpdateUser(ctx context.Context, id int, updateUserDto *UpdateUserDto) (*User, error)
	Count(ctx context.Context, filters Filters) (int, error)
}
