package user

import "github.com/JuD4Mo/gopher-gains/pkg/validation"

type (
	CreateUserDto struct {
		Name     string `json:"name" validate:"required,min=1,max=50"`
		LastName string `json:"lastName" validate:"required,min=1,max=50"`
		Email    string `json:"email" validate:"required,email"`
		Password string `json:"password" validate:"required,min=8"`
	}

	UpdateUserDto struct {
		Name     *string `json:"name" validate:"omitempty,min=1,max=50"`
		LastName *string `json:"lastName" validate:"omitempty,min=1,max=50"`
		Email    *string `json:"email" validate:"omitempty,email"`
		Password *string `json:"password" validate:"omitempty,min=8"`
	}
)

func (c *CreateUserDto) Validate() error {
	return nil
}

func (c *UpdateUserDto) Validate() error {
	if c.Name == nil && c.LastName == nil && c.Email == nil && c.Password == nil {
		return validation.CustomValidationErrors{
			{Field: "body", Message: "at least one field must be provided for update"},
		}
	}
	return nil
}
