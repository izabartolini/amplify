package services

import (
	"amplify/server/internal/models"
)

func (s *Service) GetUsers() ([]models.User, error) {
	return s.repository.GetUsers()
}

func (s *Service) GetUsersByName(name string) ([]models.User, error) {
	return s.repository.GetUsersByName(name)
}
