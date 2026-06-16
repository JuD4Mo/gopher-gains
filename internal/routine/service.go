package routine

import "context"

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{
		repo: repo,
	}
}

func (s *service) CreateRoutine(ctx context.Context, createRoutineDto *CreateRoutineDto) (*Routine, error) {
	routine, err := s.repo.Create(ctx, createRoutineDto)
	if err != nil {
		return nil, err
	}
	return routine, nil
}

func (s *service) GetAllRoutines(ctx context.Context, filters Filters, limit, offset int) ([]Routine, error) {
	return nil, nil
}

func (s *service) GetRoutineById(ctx context.Context, id int) (*Routine, error) {
	return nil, nil
}
