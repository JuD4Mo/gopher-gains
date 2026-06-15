package routine

import "context"

type Repository interface {
	Create(ctx context.Context, createRoutineDto *CreateRoutineDto) (*Routine, error)
	GetAll(ctx context.Context, filters Filters, limit, offset int) ([]Routine, error)
	GetById(ctx context.Context, id int) (*Routine, error)
}

type Service interface {
}
