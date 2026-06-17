package routine

import "context"

type Repository interface {
	Create(ctx context.Context, createRoutineDto *CreateRoutineDto) (*Routine, error)
	GetAll(ctx context.Context, filters Filters, limit, offset int) ([]Routine, error)
	GetById(ctx context.Context, id int) (*Routine, error)
	Update(ctx context.Context, id int, updateRoutineDto *UpdateRoutineDto) (*Routine, error)
	Count(ctx context.Context, filters Filters) (int, error)
}

type Service interface {
	CreateRoutine(ctx context.Context, createRoutineDto *CreateRoutineDto) (*Routine, error)
	GetAllRoutines(ctx context.Context, filters Filters, limit, offset int) ([]Routine, error)
	GetRoutineById(ctx context.Context, id int) (*Routine, error)
	UpdateRoutine(ctx context.Context, id int, updateRoutineDto *UpdateRoutineDto) (*Routine, error)
	Count(ctx context.Context, filters Filters) (int, error)
}
