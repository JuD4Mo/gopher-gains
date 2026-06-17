package routineexercise

import "github.com/JuD4Mo/gopher-gains/pkg/validation"

type (
	CreateRoutineExerciseDto struct {
		RoutineId  int `json:"routineId" validate:"required"`
		ExerciseId int `json:"exerciseId" validate:"required"`
		StepNumber int `json:"stepNumber" validate:"required"`
	}

	UpdateRoutineExerciseDto struct {
		StepNumber *int `json:"stepNumber" validate:"omitempty"`
	}
)

func (c *CreateRoutineExerciseDto) Validate() error {
	return nil
}

func (c *UpdateRoutineExerciseDto) Validate() error {
	if c.StepNumber == nil {
		return validation.CustomValidationErrors{
			{Field: "body", Message: "at least one field must be provided for update"},
		}
	}
	return nil
}
