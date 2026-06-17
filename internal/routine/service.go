package routine

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

func (s *service) CreateRoutine(ctx context.Context, createRoutineDto *CreateRoutineDto) (*Routine, error) {
	routine, err := s.repo.Create(ctx, createRoutineDto)
	if err != nil {
		return nil, err
	}
	return routine, nil
}

func (s *service) GetAllRoutines(ctx context.Context, filters Filters, limit, offset int) ([]Routine, error) {
	routines, err := s.repo.GetAll(ctx, filters, limit, offset)
	if err != nil {
		return nil, err
	}

	return routines, nil
}

func (s *service) GetRoutineById(ctx context.Context, id int) (*Routine, error) {
	routine, err := s.repo.GetById(ctx, id)
	if err != nil {
		if errors.Is(err, ErrNotFound) {
			return nil, errs.NewNotFoundError(
				fmt.Sprintf("error! routine with id: %d not found", id),
				true,
				nil,
			)
		}
		return nil, err
	}

	return routine, nil
}

func (s *service) UpdateRoutine(ctx context.Context, id int, updateRoutineDto *UpdateRoutineDto) (*Routine, error) {
	_, err := s.GetRoutineById(ctx, id)
	if err != nil {
		return nil, err
	}

	routine, err := s.repo.Update(ctx, id, updateRoutineDto)
	if err != nil {
		return nil, err
	}

	return routine, nil
}

func (s *service) Count(ctx context.Context, filters Filters) (int, error) {
	numRoutines, err := s.repo.Count(ctx, filters)
	if err != nil {
		return 0, err
	}

	return numRoutines, nil
}
