package exercise

import (
	"context"
	"errors"
	"fmt"

	"github.com/JuD4Mo/gopher-gains/internal/errs"
)

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

func (s *service) GetExerciseById(ctx context.Context, id int) (*Exercise, error) {
	exercise, err := s.repo.GetById(ctx, id)
	if err != nil {
		if errors.Is(err, ErrNotFound) {
			return nil, errs.NewNotFoundError(
				fmt.Sprintf("error! exercise with id: %d not found", id),
				true,
				nil,
			)
		}
		return nil, err
	}

	return exercise, nil
}

func (s *service) UpdateExercise(ctx context.Context, id int, updateExerciseDto *UpdateExerciseDto) (*Exercise, error) {
	//check if the exercise exists
	_, err := s.GetExerciseById(ctx, id)
	if err != nil {
		return nil, err
	}

	exercise, err := s.repo.Update(ctx, id, updateExerciseDto)
	if err != nil {
		return nil, err
	}

	return exercise, nil
}
