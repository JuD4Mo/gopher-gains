package user

import "time"

type (
	User struct {
		Id            int       `json:"id" db:"id"`
		Name          string    `json:"name" db:"name"`
		LastName      string    `json:"lastName" db:"last_name"`
		Email         string    `json:"email" db:"email"`
		Password      string    `json:"-" db:"password"`
		UsedPasswords []string  `json:"-" db:"used_passwords"`
		CreatedAt     time.Time `json:"createdAt" db:"created_at"`
		UpdatedAt     time.Time `json:"updatedAt" db:"updated_at"`
	}

	Filters struct {
		Name     string
		LastName string
		Email    string
		Order    int
	}
)
