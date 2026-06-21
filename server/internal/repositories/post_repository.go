package repositories

import "amplify/server/internal/models"

func (r *Repository) CreatePost(post *models.Post) error {
	return r.db.Create(post).Error
}
