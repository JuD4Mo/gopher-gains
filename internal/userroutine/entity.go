package userroutine

import "time"

type (
	UserRoutine struct {
		UserId     int       `json:"userId" db:"user_id"`
		RoutineId  int       `json:"routineId" db:"routine_id"`
		AssignedAt time.Time `json:"assignedAt" db:"assigned_at"`
	}
)
