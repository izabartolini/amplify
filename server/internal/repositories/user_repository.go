package repositories

import (
	"amplify/server/internal/models"
	"errors"

	"gorm.io/gorm"
)

type Repository struct{ db *gorm.DB }

func NewRepository(db *gorm.DB) *Repository { return &Repository{db: db} }

func (r *Repository) FindUserWithRelations(id uint, user *models.User) error {
	return r.db.Preload("Tag").Preload("Plays").First(user, id).Error
}

func (r *Repository) GetUsers() ([]models.User, error) {
	var users []models.User
	err1 := r.db.Select("id, email, name, username, password, bio").Find(&users).Error
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
		Where("email ILIKE ?", findEmail).
		First(&user).Error

	if err != nil {
		return nil, err
	}

	return &user, nil

}

func (r *Repository) GetUserById(id uint) (*models.User, error) {
	var user models.User
	err := r.db.First(&user, id).Error
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *Repository) UpdateUser(id uint, data map[string]interface{}) error {

	return r.db.Model(&models.User{}).Where("id = ?", id).Updates(data).Error
}

func (r *Repository) DeleteUser(id uint) error {
	result := r.db.Delete(&models.User{}, id)
	return result.Error
}

func (r *Repository) GetUserActivity(userID uint) ([]map[string]interface{}, error) {
	var activities []map[string]interface{}

	// Likes
	var likes []models.Like
	if err := r.db.Where("user_id = ?", userID).Order("created_at desc").Find(&likes).Error; err != nil {
		return nil, err
	}
	for _, l := range likes {
		var post models.Post
		var postAuthor models.User
		r.db.Select("id, subtitle, user_id").First(&post, l.PostID)
		r.db.Select("id, name, username, profile_picture").First(&postAuthor, post.UserID)
		activities = append(activities, map[string]interface{}{
			"type":          "like",
			"post_id":       l.PostID,
			"post_subtitle": post.Subtitle,
			"post_author": map[string]interface{}{
				"id":              postAuthor.ID,
				"name":            postAuthor.Name,
				"username":        postAuthor.Username,
				"profile_picture": postAuthor.ProfilePicture,
			},
			"created_at": l.CreatedAt,
		})
	}

	// Comments
	var comments []models.Comment
	if err := r.db.Where("user_id = ?", userID).Order("created_at desc").Find(&comments).Error; err != nil {
		return nil, err
	}
	for _, c := range comments {
		var post models.Post
		var postAuthor models.User
		r.db.Select("id, subtitle, user_id").First(&post, c.PostID)
		r.db.Select("id, name, username, profile_picture").First(&postAuthor, post.UserID)
		activities = append(activities, map[string]interface{}{
			"type":          "comment",
			"post_id":       c.PostID,
			"post_subtitle": post.Subtitle,
			"text":          c.Text,
			"post_author": map[string]interface{}{
				"id":              postAuthor.ID,
				"name":            postAuthor.Name,
				"username":        postAuthor.Username,
				"profile_picture": postAuthor.ProfilePicture,
			},
			"created_at": c.CreatedAt,
		})
	}

	// Follows
	var follows []models.Follow
	if err := r.db.Where("follower_id = ? AND deleted_at IS NULL", userID).Order("created_at desc").Find(&follows).Error; err != nil {
		return nil, err
	}
	for _, f := range follows {
		var followedUser models.User
		r.db.Select("id, name, username, profile_picture").First(&followedUser, f.FollowingID)
		activities = append(activities, map[string]interface{}{
			"type":         "follow",
			"following_id": f.FollowingID,
			"followed_user": map[string]interface{}{
				"id":              followedUser.ID,
				"name":            followedUser.Name,
				"username":        followedUser.Username,
				"profile_picture": followedUser.ProfilePicture,
			},
			"created_at": f.CreatedAt,
		})
	}

	return activities, nil
}

type PostAuthor struct {
	ID             uint   `json:"id"`
	Name           string `json:"name"`
	Username       string `json:"username"`
	ProfilePicture string `json:"profile_picture"`
	City           string `json:"city"`
	State          string `json:"state"`
}

func (r *Repository) GetPostsByUser(userID uint) ([]models.Post, error) {
	var posts []models.Post
	err := r.db.
		Where("user_id = ?", userID).
		Preload("Medias").
		Preload("Likes").
		Preload("Comments").
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("users.id, users.name, users.username, users.profile_picture, users.city, users.state")
		}).
		Order("created_at desc").
		Find(&posts).Error
	return posts, err
}

func (r *Repository) GetEventsByUser(userID uint) ([]models.Event, error) {
	var events []models.Event
	err := r.db.
		Where("user_id = ?", userID).
		Preload("Medias").
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("users.id, users.name, users.username, users.profile_picture, users.city, users.state")
		}).
		Order("date asc").
		Find(&events).Error
	return events, err
}

func (r *Repository) GetUserByID(userID uint) (*models.User, error) {
	var user models.User
	err := r.db.
		Select("id, name, username, profile_picture, bio, city, state, country").
		Preload("Tag.Tag").
		Preload("Plays.Instrument").
		First(&user, userID).Error
	if err != nil {
		return nil, err
	}

	var followersCount int64
	r.db.Model(&models.Follow{}).Where("following_id = ?", userID).Count(&followersCount)

	var followingCount int64
	r.db.Model(&models.Follow{}).Where("follower_id = ?", userID).Count(&followingCount)

	user.Followers = make([]models.Follow, followersCount)
	user.Following = make([]models.Follow, followingCount)

	return &user, nil
}

func (r *Repository) FollowUser(followerID uint, followingID uint) error {
	follow := models.Follow{
		FollowerID:  followerID,
		FollowingID: followingID,
	}
	return r.db.Create(&follow).Error
}

func (r *Repository) UnfollowUser(followerID uint, followingID uint) error {
	return r.db.
		Where("follower_id = ? AND following_id = ?", followerID, followingID).
		Delete(&models.Follow{}).Error
}

func (r *Repository) IsFollowing(followerID uint, followingID uint) (bool, error) {
	var count int64
	err := r.db.Model(&models.Follow{}).
		Where("follower_id = ? AND following_id = ?", followerID, followingID).
		Count(&count).Error
	return count > 0, err
}

func (r *Repository) GetFollowers(userID uint) ([]models.User, error) {
	var users []models.User
	err := r.db.Raw(`
		SELECT users.id, users.name, users.username, users.profile_picture, users.city, users.state
		FROM users
		INNER JOIN follows ON follows.follower_id = users.id
		WHERE follows.following_id = ?
		AND follows.deleted_at IS NULL
	`, userID).Scan(&users).Error
	return users, err
}

func (r *Repository) GetFollowing(userID uint) ([]models.User, error) {
	var users []models.User
	err := r.db.Raw(`
		SELECT users.id, users.name, users.username, users.profile_picture, users.city, users.state
		FROM users
		INNER JOIN follows ON follows.following_id = users.id
		WHERE follows.follower_id = ?
		AND follows.deleted_at IS NULL
	`, userID).Scan(&users).Error
	return users, err
}
