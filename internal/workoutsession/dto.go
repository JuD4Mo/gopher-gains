package workoutsession

import (
	"time"

	"github.com/JuD4Mo/gopher-gains/pkg/validation"
)

type (
	CreateWorkoutSessionDto struct {
		UserId       int     `json:"userId" validate:"required"`
		Observations *string `json:"observations"`
	}

	UpdateWorkoutSessionDto struct {
		Status       *SessionStatusEnum `json:"status" validate:"omitempty,oneof=in_progress finished"`
		EndTime      *time.Time         `json:"endTime"`
		Observations *string            `json:"observations"`
	}
)

func (c *CreateWorkoutSessionDto) Validate() error {
	return nil
}

func (c *UpdateWorkoutSessionDto) Validate() error {
	if c.Status == nil && c.EndTime == nil && c.Observations == nil {
		return validation.CustomValidationErrors{
			{Field: "body", Message: "at least one field must be provided for update"},
		}
	}
	return nil
}
