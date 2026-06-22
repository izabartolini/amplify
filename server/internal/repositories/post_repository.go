package repositories

import (
	"amplify/server/internal/models"
	"errors"
)

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

func (r *Repository) LikePost(userID uint, postID uint) error {
	var count int64
	r.db.Model(&models.Like{}).Where("user_id = ? AND post_id = ?", userID, postID).Count(&count)
	if count > 0 {
		return errors.New("usuário já curtiu este post")
	}

	like := models.Like{
		UserID: userID,
		PostID: postID,
	}
	return r.db.Create(&like).Error
}
