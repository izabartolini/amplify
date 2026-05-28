package repositories

import (
	"amplify/server/internal/models"

	"gorm.io/gorm"
)

type Repository struct{ db *gorm.DB }

func NewRepository(db *gorm.DB) *Repository { return &Repository{db: db} }

func (r *Repository) GetUsers() ([]models.User, error) {

	var users []models.User

	err := r.db.Select("email, name").Find(&users).Error

	return users, err
}



func (r *Repository) PostUser(user *models.User) error {

	return r.db.Create(user).Error
}
