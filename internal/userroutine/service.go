package userroutine

import "context"

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{
		repo: repo,
	}
}

func (s *service) AssignRoutine(ctx context.Context, createDto *CreateUserRoutineDto) (*UserRoutine, error) {
	userRoutine, err := s.repo.Create(ctx, createDto)
	if err != nil {
		return nil, err
	}

	return userRoutine, nil
}

func (s *service) GetUserRoutines(ctx context.Context, userId int) ([]UserRoutine, error) {
	routines, err := s.repo.GetByUserId(ctx, userId)
	if err != nil {
		return nil, err
	}

	return routines, nil
}

func (s *service) GetRoutineUsers(ctx context.Context, routineId int) ([]UserRoutine, error) {
	users, err := s.repo.GetByRoutineId(ctx, routineId)
	if err != nil {
		return nil, err
	}

	return users, nil
}
