package repositories

import (
	"amplify/server/internal/models"

	"gorm.io/gorm"
)

func (r *Repository) CreateNotification(notification *models.Notification) error {
	return r.db.Create(notification).Error
}

func (r *Repository) GetNotificationsByRecipient(recipientID uint) ([]models.Notification, error) {
	var notifications []models.Notification
	err := r.db.
		Preload("Actor", func(db *gorm.DB) *gorm.DB {
			return db.Select("users.id, users.name, users.username, users.profile_picture")
		}).
		Preload("Post").
		Where("recipient_id = ?", recipientID).
		Order("created_at desc").
		Find(&notifications).Error
	return notifications, err
}

func (r *Repository) MarkNotificationAsRead(notificationID uint, recipientID uint) error {
	result := r.db.Model(&models.Notification{}).
		Where("id = ? AND recipient_id = ?", notificationID, recipientID).
		Update("read", true)
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return result.Error
}
