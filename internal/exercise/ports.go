package exercise

import "context"

type Repository interface {
	Create(ctx context.Context, createExerciseDto *CreateExerciseDto) (*Exercise, error)
}

type Service interface {
	CreateExercise(ctx context.Context, createExerciseDto *CreateExerciseDto) (*Exercise, error)
}
