package exercise

import "github.com/JuD4Mo/gopher-gains/pkg/validation"

type (
	CreateExerciseDto struct {
		Name              string `json:"name" validate:"required,min=1,max=50"`
		Description       string `json:"description" validate:"required,min=1,max=50"`
		ExecutionTip      string `json:"executionTip" validate:"required"`
		TargetMuscleGroup string `json:"muscleGroup" validate:"required,oneof=chest back legs arms delts abs"`
	}

	UpdateExerciseDto struct {
		Name              *string `json:"name" validate:"omitempty,min=1,max=50"`
		Description       *string `json:"description" validate:"omitempty,min=1,max=50"`
		ExecutionTip      *string `json:"executionTip" validate:"omitempty,min=1"`
		TargetMuscleGroup *string `json:"muscleGroup" validate:"omitempty,oneof=chest back legs arms delts abs"`
	}
)

func (c *CreateExerciseDto) Validate() error {
	return nil
}

func (c *UpdateExerciseDto) Validate() error {
	if c.Name == nil && c.Description == nil && c.ExecutionTip == nil && c.TargetMuscleGroup == nil {
		return validation.CustomValidationErrors{
			{Field: "body", Message: "at least one field must be provided for update"},
		}
	}
	return nil
}
