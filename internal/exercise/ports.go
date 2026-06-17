package exercise

import "context"

type Repository interface {
	Create(ctx context.Context, createExerciseDto *CreateExerciseDto) (*Exercise, error)
	GetAll(ctx context.Context, filters Filters, limit, offset int) ([]Exercise, error)
	GetById(ctx context.Context, id int) (*Exercise, error)
	Count(ctx context.Context, filter Filters) (int, error)
	Update(ctx context.Context, id int, updateExerciseDto *UpdateExerciseDto) (*Exercise, error)
}

type Service interface {
	CreateExercise(ctx context.Context, createExerciseDto *CreateExerciseDto) (*Exercise, error)
	GetAllExercises(ctx context.Context, filters Filters, limit, offset int) ([]Exercise, error)
	GetExerciseById(ctx context.Context, id int) (*Exercise, error)
	Count(ctx context.Context, filters Filters) (int, error)
	UpdateExercise(ctx context.Context, id int, updateExerciseDto *UpdateExerciseDto) (*Exercise, error)
}
