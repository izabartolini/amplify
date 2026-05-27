package repositories

import (
	"amplify/server/internal/models"

	"gorm.io/gorm"
)

type Repository struct{ db *gorm.DB }

func NewRepository(db *gorm.DB) *Repository { return &Repository{db: db} }

func (r *Repository) GetUsers() ([]models.User, error) {

	var users []models.User

	err := r.db.Find(&users).Error

	return users, err
}

// func (r *Repository) GetUsers() ([]models.User, error) {
// 	rows, err := r.db.Query("SELECT email, password FROM users")
// 	if err != nil {
// 		return nil, err
// 	}

// 	defer rows.Close()

// 	usuarios := []models.User{}

// 	for rows.Next() {

// 		var u models.User

// 		err := rows.Scan(&u.Email, &u.Password)
// 		if err != nil {
// 			return nil, err
// 		}
// 		usuarios = append(usuarios, u)
// 	}
// 	return usuarios, nil

//}
