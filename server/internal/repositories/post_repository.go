package repositories

import "amplify/server/internal/models"

func (r *Repository) CreatePost(post *models.Post) error {
	return r.db.Create(post).Error
}

func (r *Repository) GetFeed() ([]models.Post, error) {
	var posts []models.Post
	err := r.db.
		Preload("Medias").
		Preload("Likes").
		Preload("Comments").
		Preload("User").
		Order("created_at desc").
		Find(&posts).Error
	return posts, err
}

func (r *Repository) GetPostByID(id uint) (*models.Post, error) {
	var post models.Post
	err := r.db.
		Preload("Medias").
		Preload("Likes").
		Preload("Comments").
		Preload("User").
		First(&post, id).Error
	return &post, err
}
