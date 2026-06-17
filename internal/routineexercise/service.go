package routineexercise

import "context"

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{
		repo: repo,
	}
}

func (s *service) AddExercise(ctx context.Context, createDto *CreateRoutineExerciseDto) (*RoutineExercise, error) {
	re, err := s.repo.Create(ctx, createDto)
	if err != nil {
		return nil, err
	}

	return re, nil
}

func (s *service) GetRoutineExercises(ctx context.Context, routineId int) ([]RoutineExercise, error) {
	exercises, err := s.repo.GetByRoutineId(ctx, routineId)
	if err != nil {
		return nil, err
	}

	return exercises, nil
}

func (s *service) UpdateStep(ctx context.Context, routineId, exerciseId int, stepNumber int) (*RoutineExercise, error) {
	re, err := s.repo.UpdateStep(ctx, routineId, exerciseId, stepNumber)
	if err != nil {
		return nil, err
	}

	return re, nil
}

func (s *service) RemoveExercise(ctx context.Context, routineId, exerciseId int) error {
	err := s.repo.Delete(ctx, routineId, exerciseId)
	if err != nil {
		return err
	}

	return nil
}
