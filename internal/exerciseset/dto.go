package exerciseset

import (
	"time"

	"github.com/JuD4Mo/gopher-gains/pkg/validation"
)

type (
	CreateExerciseSetDto struct {
		WsessionId  int     `json:"wsessionId" validate:"required"`
		ExerciseId  int     `json:"exerciseId" validate:"required"`
		StepNumber  int     `json:"stepNumber" validate:"required"`
		Weight      float64 `json:"weight" validate:"required"`
		Repetitions int     `json:"repetitions" validate:"required"`
		Rir         *int    `json:"rir" validate:"omitempty,min=0,max=10"`
	}

	UpdateExerciseSetDto struct {
		Weight      *float64 `json:"weight" validate:"omitempty"`
		Repetitions *int     `json:"repetitions" validate:"omitempty"`
		Rir         *int     `json:"rir" validate:"omitempty,min=0,max=10"`
		StepNumber  *int     `json:"stepNumber" validate:"omitempty"`
	}

	SetProgressResponseDto struct {
		Start_time  time.Time `json:"start_time" db:"start_time"`
		Weight      float64   `json:"weight" db:"weight"`
		Repetitions int       `json:"repetitions" db:"repetitions"`
		PrevWeight  *float64  `json:"prev_weight" db:"prev_weight"`
		PrevReps    *int      `json:"prev_reps" db:"prev_reps"`
		ProgressPct *float64  `json:"progress_pct" db:"progress_pct"`
	}
)

func (c *CreateExerciseSetDto) Validate() error {
	return nil
}

func (c *UpdateExerciseSetDto) Validate() error {
	if c.Weight == nil && c.Repetitions == nil && c.Rir == nil && c.StepNumber == nil {
		return validation.CustomValidationErrors{
			{Field: "body", Message: "at least one field must be provided for update"},
		}
	}
	return nil
}

func (c *SetProgressResponseDto) Validate() error {
	return nil
}
