package workoutsession

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

func (s *service) CreateSession(ctx context.Context, createDto *CreateWorkoutSessionDto) (*WorkoutSession, error) {
	session, err := s.repo.Create(ctx, createDto)
	if err != nil {
		return nil, err
	}

	return session, nil
}

func (s *service) GetAllSessions(ctx context.Context, filters Filters, limit, offset int) ([]WorkoutSession, error) {
	sessions, err := s.repo.GetAll(ctx, filters, limit, offset)
	if err != nil {
		return nil, err
	}

	return sessions, nil
}

func (s *service) GetSessionById(ctx context.Context, id int) (*WorkoutSession, error) {
	session, err := s.repo.GetById(ctx, id)
	if err != nil {
		if errors.Is(err, ErrNotFound) {
			return nil, errs.NewNotFoundError(
				fmt.Sprintf("error! session with id: %d not found", id),
				true,
				nil,
			)
		}
		return nil, err
	}

	return session, nil
}

func (s *service) UpdateSession(ctx context.Context, id int, updateDto *UpdateWorkoutSessionDto) (*WorkoutSession, error) {
	_, err := s.GetSessionById(ctx, id)
	if err != nil {
		return nil, err
	}

	session, err := s.repo.Update(ctx, id, updateDto)
	if err != nil {
		return nil, err
	}

	return session, nil
}

func (s *service) Count(ctx context.Context, filters Filters) (int, error) {
	numSessions, err := s.repo.Count(ctx, filters)
	if err != nil {
		return 0, err
	}

	return numSessions, nil
}
