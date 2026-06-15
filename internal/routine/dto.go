package routine

type CreateRoutineDto struct {
	Name        string          `json:"name" validate:"required,min=1,max=50"`
	Description string          `json:"description" validate:"required,min=1"`
	Frequency   int             `json:"frequency" validate:"required"`
	RoutineType RoutineTypeEnum `json:"type" validate:"oneof=default customized"`
}

func (c *CreateRoutineDto) Validate() error {
	return nil
}
