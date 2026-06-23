package exerciseset

import (
	"context"
)

type Repository interface {
	Create(ctx context.Context, createDto *CreateExerciseSetDto) (*ExerciseSet, error)
	GetAll(ctx context.Context, filters Filters, limit, offset int) ([]ExerciseSet, error)
	GetById(ctx context.Context, id int) (*ExerciseSet, error)
	Update(ctx context.Context, id int, updateDto *UpdateExerciseSetDto) (*ExerciseSet, error)
	GetSetProgress(ctx context.Context, exerciseId int, step int, specificDate string) (*SetProgressResponseDto, error)
	Count(ctx context.Context, filters Filters) (int, error)
}

type Service interface {
	CreateSet(ctx context.Context, createDto *CreateExerciseSetDto) (*ExerciseSet, error)
	GetAllSets(ctx context.Context, filters Filters, limit, offset int) ([]ExerciseSet, error)
	GetSetById(ctx context.Context, id int) (*ExerciseSet, error)
	UpdateSet(ctx context.Context, id int, updateDto *UpdateExerciseSetDto) (*ExerciseSet, error)
	GetSetProgress(ctx context.Context, exerciseId int, step int, specificDate string) (*SetProgressResponseDto, error)
	Count(ctx context.Context, filters Filters) (int, error)
}
