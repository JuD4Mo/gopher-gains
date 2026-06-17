package user

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

func (s *service) CreateUser(ctx context.Context, createUserDto *CreateUserDto) (*User, error) {
	user, err := s.repo.Create(ctx, createUserDto)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *service) GetAllUsers(ctx context.Context, filters Filters, limit, offset int) ([]User, error) {
	users, err := s.repo.GetAll(ctx, filters, limit, offset)
	if err != nil {
		return nil, err
	}

	return users, nil
}

func (s *service) GetUserById(ctx context.Context, id int) (*User, error) {
	user, err := s.repo.GetById(ctx, id)
	if err != nil {
		if errors.Is(err, ErrNotFound) {
			return nil, errs.NewNotFoundError(
				fmt.Sprintf("error! user with id: %d not found", id),
				true,
				nil,
			)
		}
		return nil, err
	}

	return user, nil
}

func (s *service) UpdateUser(ctx context.Context, id int, updateUserDto *UpdateUserDto) (*User, error) {
	_, err := s.GetUserById(ctx, id)
	if err != nil {
		return nil, err
	}

	user, err := s.repo.Update(ctx, id, updateUserDto)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *service) Count(ctx context.Context, filters Filters) (int, error) {
	numUsers, err := s.repo.Count(ctx, filters)
	if err != nil {
		return 0, err
	}

	return numUsers, nil
}
