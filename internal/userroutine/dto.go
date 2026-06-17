package userroutine

type (
	CreateUserRoutineDto struct {
		UserId    int `json:"userId" validate:"required"`
		RoutineId int `json:"routineId" validate:"required"`
	}
)

func (c *CreateUserRoutineDto) Validate() error {
	return nil
}
