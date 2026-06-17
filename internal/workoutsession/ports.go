package workoutsession

import "context"

type Repository interface {
	Create(ctx context.Context, createDto *CreateWorkoutSessionDto) (*WorkoutSession, error)
	GetAll(ctx context.Context, filters Filters, limit, offset int) ([]WorkoutSession, error)
	GetById(ctx context.Context, id int) (*WorkoutSession, error)
	Update(ctx context.Context, id int, updateDto *UpdateWorkoutSessionDto) (*WorkoutSession, error)
	Count(ctx context.Context, filters Filters) (int, error)
}

type Service interface {
	CreateSession(ctx context.Context, createDto *CreateWorkoutSessionDto) (*WorkoutSession, error)
	GetAllSessions(ctx context.Context, filters Filters, limit, offset int) ([]WorkoutSession, error)
	GetSessionById(ctx context.Context, id int) (*WorkoutSession, error)
	UpdateSession(ctx context.Context, id int, updateDto *UpdateWorkoutSessionDto) (*WorkoutSession, error)
	Count(ctx context.Context, filters Filters) (int, error)
}
