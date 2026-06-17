package routineexercise

import "context"

type Repository interface {
	Create(ctx context.Context, createDto *CreateRoutineExerciseDto) (*RoutineExercise, error)
	GetByRoutineId(ctx context.Context, routineId int) ([]RoutineExercise, error)
	UpdateStep(ctx context.Context, routineId, exerciseId int, stepNumber int) (*RoutineExercise, error)
	Delete(ctx context.Context, routineId, exerciseId int) error
}

type Service interface {
	AddExercise(ctx context.Context, createDto *CreateRoutineExerciseDto) (*RoutineExercise, error)
	GetRoutineExercises(ctx context.Context, routineId int) ([]RoutineExercise, error)
	UpdateStep(ctx context.Context, routineId, exerciseId int, stepNumber int) (*RoutineExercise, error)
	RemoveExercise(ctx context.Context, routineId, exerciseId int) error
}
