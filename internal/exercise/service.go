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

func (s service) CreateExercise(ctx context.Context, createExerciseDto *CreateExerciseDto) (*Exercise, error) {
	exercise, err := s.repo.Create(ctx, createExerciseDto)
	if err != nil {
		return nil, err
	}

	return exercise, nil
}
