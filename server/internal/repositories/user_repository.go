package repositories

import (
	"amplify/server/internal/models"
	"errors"
	"regexp"
	"strings"

	"gorm.io/gorm"
)

type Repository struct{ db *gorm.DB }

func NewRepository(db *gorm.DB) *Repository { return &Repository{db: db} }

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

func (r *Repository) GetUserById (id uint) (*models.User, error){
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

func (r *Repository) SaveUserTags(userID uint, tagNames []string) {
	var tagValidationRegex = regexp.MustCompile(`^[A-Z0-9]+$`)

	for _, name := range tagNames {
		cleanName := strings.ToUpper(strings.TrimSpace(name))
		if cleanName == "" {
			continue
		}
		if !tagValidationRegex.MatchString(cleanName) {
			continue
		}

		var tag models.Tag
		if err := r.db.FirstOrCreate(&tag, models.Tag{Name: cleanName}).Error; err != nil {
			continue
		}

		userTag := models.UserTag{
			UserID: userID,
			TagID:  tag.ID,
		}

		r.db.Create(&userTag)
	}
}
func (r *Repository) DeleteUser(id uint) error {
	result := r.db.Delete(&models.User{}, id)
	return result.Error
}

func (r *Repository) GetUserActivity(userID uint) ([]map[string]interface{}, error) {
	var activities []map[string]interface{}

	var likes []models.Like
	if err := r.db.Where("user_id = ?", userID).Order("created_at desc").Find(&likes).Error; err != nil {
		return nil, err
	}
	for _, l := range likes {
		activities = append(activities, map[string]interface{}{
			"type":       "like",
			"post_id":    l.PostID,
			"created_at": l.CreatedAt,
		})
	}

	var comments []models.Comment
	if err := r.db.Where("user_id = ?", userID).Order("created_at desc").Find(&comments).Error; err != nil {
		return nil, err
	}
	for _, c := range comments {
		activities = append(activities, map[string]interface{}{
			"type":       "comment",
			"post_id":    c.PostID,
			"text":       c.Text,
			"created_at": c.CreatedAt,
		})
	}

	var follows []models.Follow
	if err := r.db.Where("follower_id = ?", userID).Order("created_at desc").Find(&follows).Error; err != nil {
		return nil, err
	}
	for _, f := range follows {
		activities = append(activities, map[string]interface{}{
			"type":         "follow",
			"following_id": f.FollowingID,
			"created_at":   f.CreatedAt,
		})
	}

	return activities, nil
}
