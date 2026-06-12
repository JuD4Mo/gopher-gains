package exercise

type (
	CreateExerciseDto struct {
		Name              string `json:"name" validate:"required,min=1,max=50"`
		Description       string `json:"description" validate:"required"`
		ExecutionTip      string `json:"executionTip" validate:"required"`
		TargetMuscleGroup string `json:"muscleGroup" validate:"required,oneof=chest back legs arms delts abs"`
	}

	UpdateExerciseDto struct {
		Name              string `json:"name" validate:"omitempty,min=1,max=50"`
		Description       string `json:"description" validate:"omitempty,min=1,max=50"`
		ExecutionTip      string `json:"executionTip" validate:"omitempty,min=1,max=50"`
		TargetMuscleGroup string `json:"muscleGroup" validate:"omitempty,oneof=chest back legs arms delts abs"`
	}
)

func (c *CreateExerciseDto) Validate() error {
	return nil
}
func (c *UpdateExerciseDto) Validate() error {
	return nil
}
