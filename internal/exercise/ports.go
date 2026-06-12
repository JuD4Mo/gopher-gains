package exercise

import "context"

type Repository interface {
	Create(ctx context.Context, createExerciseDto *CreateExerciseDto) (*Exercise, error)
	GetAll(ctx context.Context, filters Filters, limit, offset int) ([]Exercise, error)
	GetById(ctx context.Context, id int) (*Exercise, error)
	Count(ctx context.Context, filter Filters) (int, error)
}

type Service interface {
	CreateExercise(ctx context.Context, createExerciseDto *CreateExerciseDto) (*Exercise, error)
	GetAllExercises(ctx context.Context, filters Filters, limit, offset int) ([]Exercise, error)
	GetExerciseById(ctx context.Context, id int) (*Exercise, error)
	Count(ctx context.Context, filters Filters) (int, error)
}
