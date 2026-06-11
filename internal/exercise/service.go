package exercise

import "context"

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{
		repo: repo,
	}
}

func (s *service) CreateExercise(ctx context.Context, createExerciseDto *CreateExerciseDto) (*Exercise, error) {
	exercise, err := s.repo.Create(ctx, createExerciseDto)
	if err != nil {
		return nil, err
	}

	return exercise, nil
}

func (s *service) GetAllExercises(ctx context.Context, filters Filters, limit, offset int) ([]Exercise, error) {
	exercises, err := s.repo.GetAll(ctx, filters, limit, offset)
	if err != nil {
		return nil, err
	}

	return exercises, nil
}

func (s *service) Count(ctx context.Context, filters Filters) (int, error) {
	numExercises, err := s.repo.Count(ctx, filters)
	if err != nil {
		return 0, err
	}

	return numExercises, nil
}
