package routine

import "github.com/JuD4Mo/gopher-gains/pkg/validation"

type (
	CreateRoutineDto struct {
		Name        string          `json:"name" validate:"required,min=1,max=50"`
		Description string          `json:"description" validate:"required,min=1"`
		Frequency   int             `json:"frequency" validate:"required"`
		RoutineType RoutineTypeEnum `json:"type" validate:"oneof=default customized"`
	}

	UpdateRoutineDto struct {
		Name        *string          `json:"name" validate:"omitempty,min=1,max=50"`
		Description *string          `json:"description" validate:"omitempty,min=1"`
		Frequency   *int             `json:"frequency" validate:"omitempty"`
		RoutineType *RoutineTypeEnum `json:"type" validate:"omitempty,oneof=default customized"`
	}
)

func (c *CreateRoutineDto) Validate() error {
	return nil
}

func (c *UpdateRoutineDto) Validate() error {
	if c.Name == nil && c.Description == nil && c.Frequency == nil && c.RoutineType == nil {
		return validation.CustomValidationErrors{
			{Field: "body", Message: "at least one field must be provided for update"},
		}
	}
	return nil
}
