package exerciseset

import "github.com/JuD4Mo/gopher-gains/pkg/validation"

type (
	CreateExerciseSetDto struct {
		WsessionId  int     `json:"wsessionId" validate:"required"`
		ExerciseId  int     `json:"exerciseId" validate:"required"`
		Weight      float64 `json:"weight" validate:"required"`
		Repetitions int     `json:"repetitions" validate:"required"`
		Rir         *int    `json:"rir" validate:"omitempty,min=0,max=10"`
	}

	UpdateExerciseSetDto struct {
		Weight      *float64 `json:"weight" validate:"omitempty"`
		Repetitions *int     `json:"repetitions" validate:"omitempty"`
		Rir         *int     `json:"rir" validate:"omitempty,min=0,max=10"`
	}
)

func (c *CreateExerciseSetDto) Validate() error {
	return nil
}

func (c *UpdateExerciseSetDto) Validate() error {
	if c.Weight == nil && c.Repetitions == nil && c.Rir == nil {
		return validation.CustomValidationErrors{
			{Field: "body", Message: "at least one field must be provided for update"},
		}
	}
	return nil
}
