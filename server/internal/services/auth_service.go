package services

import (
	"amplify/server/internal/repositories"
	"amplify/server/internal/utils"

	"errors"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Service struct {
	repository *repositories.Repository
}

func NewService(repository *repositories.Repository) *Service {
	return &Service{
		repository: repository,
	}
}

func (s *Service) Login(email string, password string) (string, error) {

	user, err := s.repository.GetUserByEmail(email)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", errors.New("user_not_found")
		}
		return "", err
	}

	err = bcrypt.CompareHashAndPassword(
		[]byte(user.Password),
		[]byte(password),
	)

	if err != nil {
		return "", errors.New("invalid_password")
	}

	token, nil := utils.GenerateToken(user.ID, user.Email)

	return token, nil
}
