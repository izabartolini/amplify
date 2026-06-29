package repositories

import (
	"amplify/server/internal/models"
	"errors"

	"gorm.io/gorm"
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
		Preload("Comments.User", func(db *gorm.DB) *gorm.DB {
			return db.Select("users.id, users.name, users.username, users.profile_picture")
		}).
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("users.id, users.name, users.username, users.profile_picture, users.city, users.state")
		}).
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
		Preload("Comments.User", func(db *gorm.DB) *gorm.DB {
			return db.Select("users.id, users.name, users.username, users.profile_picture")
		}).
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("users.id, users.name, users.username, users.profile_picture, users.city, users.state")
		}).
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

func (r *Repository) UnlikePost(userID uint, postID uint) error {
	result := r.db.Where("user_id = ? AND post_id = ?", userID, postID).Delete(&models.Like{})
	if result.RowsAffected == 0 {
		return errors.New("curtida não encontrada")
	}
	return result.Error
}

func (r *Repository) CreateComment(comment *models.Comment) error {
	return r.db.Create(comment).Error
}

func (r *Repository) DeleteComment(commentID uint, userID uint, postID uint) error {
	var comment models.Comment
	if err := r.db.First(&comment, commentID).Error; err != nil {
		return errors.New("comentário não encontrado")
	}

	var post models.Post
	if err := r.db.First(&post, postID).Error; err != nil {
		return errors.New("post não encontrado")
	}

	if comment.UserID != userID && post.UserID != userID {
		return errors.New("sem permissão para deletar este comentário")
	}

	return r.db.Unscoped().Delete(&comment).Error
}
