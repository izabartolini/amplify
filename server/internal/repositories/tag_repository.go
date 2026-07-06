

package repositories

import (
	"amplify/server/internal/models"
	"fmt"
	"regexp"
	"strings"

	"gorm.io/gorm"
)

type TagRepository struct {
	db *gorm.DB
}

func NewTagRepository(db *gorm.DB) *TagRepository {
	return &TagRepository{db: db}
}

func (r *TagRepository) GetAllTags(searchQuery string) ([]models.Tag, error) {
	var tag []models.Tag
	
	query := r.db.Order("name asc")

	if searchQuery != "" {
		cleanSearch := strings.ToUpper(strings.TrimSpace(searchQuery))
		query = query.Where("name LIKE ?", fmt.Sprintf("%%%s%%", cleanSearch))
	}
	
	err := query.Find(&tag).Error
	if err != nil {
		return nil, err
	}
	
	return tag, nil
}

func (r *Repository) SaveUserTags(userID uint, tagNames []string) error {
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

		if err := r.db.Create(&userTag).Error; err != nil {
			continue
		}
	}
	return nil
}
