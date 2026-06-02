package repositories

import (
	"amplify/server/internal/models"
	"errors"

	"gorm.io/gorm"
)

type Repository struct{ db *gorm.DB }

func NewRepository(db *gorm.DB) *Repository { return &Repository{db: db} }

func (r *Repository) GetUsers() ([]models.User, error) {
	var users []models.User
	err1 := r.db.Select("email, name").Find(&users).Error
	return users, err1
}

func (r *Repository) PostUser(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *Repository) CheckConflicts(email, username, cpf string) error {
	var count int64

	r.db.Model(&models.User{}).
		Where("LOWER(email) = LOWER(?) OR LOWER(username) = LOWER(?) OR cpf = ?", email, username, cpf).
		Count(&count)

	if count > 0 {
		return errors.New("email, usuário ou cpf já cadastrados")
	}
	return nil
}

func (r *Repository) GetUsersByName(findName string) ([]models.User, error) {

	var users []models.User
	err := r.db.Where("name ILIKE ?", "%"+findName+"%").Find(&users).Error

	return users, err
}

func (r *Repository) GetUsersByUsername(findName string) ([]models.User, error) {

	var users []models.User
	err := r.db.Where("username ILIKE ?", "%"+findName+"%").Find(&users).Error

	return users, err
}

func (r *Repository) GetUserByEmail(findEmail string) (*models.User, error) {
	var user models.User
	err := r.db.
		Where("email = ?", findEmail).
		First(&user).Error

	if err != nil {
		return nil, err
	}

	return &user, nil

}
