package exerciseset

import (
	"context"
	"errors"
	"fmt"

	"github.com/JuD4Mo/gopher-gains/internal/errs"
	"github.com/JuD4Mo/gopher-gains/internal/exercise"
)

type service struct {
	repo            Repository
	exerciseService exercise.Service
}

func NewService(repo Repository, exerciseService exercise.Service) Service {
	return &service{
		repo:            repo,
		exerciseService: exerciseService,
	}
}

func (s *service) CreateSet(ctx context.Context, createDto *CreateExerciseSetDto) (*ExerciseSet, error) {
	set, err := s.repo.Create(ctx, createDto)
	if err != nil {
		return nil, err
	}

	return set, nil
}

func (s *service) GetAllSets(ctx context.Context, filters Filters, limit, offset int) ([]ExerciseSet, error) {
	sets, err := s.repo.GetAll(ctx, filters, limit, offset)
	if err != nil {
		return nil, err
	}

	return sets, nil
}

func (s *service) GetSetById(ctx context.Context, id int) (*ExerciseSet, error) {
	set, err := s.repo.GetById(ctx, id)
	if err != nil {
		if errors.Is(err, ErrNotFound) {
			return nil, errs.NewNotFoundError(
				fmt.Sprintf("error! exercise set with id: %d not found", id),
				true,
				nil,
			)
		}
		return nil, err
	}

	return set, nil
}

func (s *service) UpdateSet(ctx context.Context, id int, updateDto *UpdateExerciseSetDto) (*ExerciseSet, error) {
	_, err := s.GetSetById(ctx, id)
	if err != nil {
		return nil, err
	}

	set, err := s.repo.Update(ctx, id, updateDto)
	if err != nil {
		return nil, err
	}

	return set, nil
}

func (s *service) GetSetProgress(ctx context.Context, exerciseId int, step int, specificDate string) (*SetProgressResponseDto, error) {
	//validate exercise
	_, err := s.exerciseService.GetExerciseById(ctx, exerciseId)
	if err != nil {
		return nil, err
	}

	progress, err := s.repo.GetSetProgress(ctx, exerciseId, step, specificDate)
	if err != nil {
		return nil, err
	}

	return progress, nil
}

func (s *service) Count(ctx context.Context, filters Filters) (int, error) {
	numSets, err := s.repo.Count(ctx, filters)
	if err != nil {
		return 0, err
	}

	return numSets, nil
}
