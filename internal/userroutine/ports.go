package userroutine

import "context"

type Repository interface {
	Create(ctx context.Context, createDto *CreateUserRoutineDto) (*UserRoutine, error)
	GetByUserId(ctx context.Context, userId int) ([]UserRoutine, error)
	GetByRoutineId(ctx context.Context, routineId int) ([]UserRoutine, error)
}

type Service interface {
	AssignRoutine(ctx context.Context, createDto *CreateUserRoutineDto) (*UserRoutine, error)
	GetUserRoutines(ctx context.Context, userId int) ([]UserRoutine, error)
	GetRoutineUsers(ctx context.Context, routineId int) ([]UserRoutine, error)
}
