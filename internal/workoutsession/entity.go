package workoutsession

import "time"

type (
	WorkoutSession struct {
		Id           int                `json:"id" db:"id"`
		UserId       int                `json:"userId" db:"user_id"`
		StartTime    time.Time          `json:"startTime" db:"start_time"`
		EndTime      *time.Time         `json:"endTime" db:"end_time"`
		Status       SessionStatusEnum  `json:"status" db:"status"`
		Observations *string            `json:"observations" db:"observations"`
		CreatedAt    time.Time          `json:"createdAt" db:"created_at"`
		UpdatedAt    time.Time          `json:"updatedAt" db:"updated_at"`
	}

	Filters struct {
		UserId int
		Status SessionStatusEnum
		Order  int
	}
)
