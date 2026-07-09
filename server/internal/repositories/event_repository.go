package repositories

import (
	"amplify/server/internal/models"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type EventRepository struct {
	DB *gorm.DB
}

func (r *Repository) CreateEvent(event *models.Event) error {
	return r.db.Create(event).Error
}

func (r *Repository) CreateParticipation(participation *models.Participate) error {
	return r.db.Create(participation).Error
}
func (r *Repository) GetEventByID(id uint) (*models.Event, error) {
	var event models.Event

	err := r.db.
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "name", "username", "profile_picture")
		}).
		Preload("Medias").
		Preload("Participants").
		Preload("Tag").
		First(&event, id).Error

	return &event, err
}
func (r *Repository) GetPendingRequests(eventID uint) ([]models.Participate, error) {
	var participation []models.Participate
	err := r.db.Where("event_id = ? AND status = ?", eventID, "pending").Find(&participation).Error
	return participation, err
}
func (r *Repository) UpdateEvent(event *models.Event) error {
	return r.db.Save(event).Error
}
func (r *Repository) DeleteEvent(event *models.Event) error {
	return r.db.Select(clause.Associations).Delete(event).Error
}
func (r *Repository) GetAllEvents() ([]models.Event, error) {
	var events []models.Event
	err := r.db.
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "name", "username", "profile_picture")
		}).
		Preload("Participants").
		Preload("Medias").
		Order("date asc").
		Find(&events).Error
	return events, err
}
func (r *Repository) GetParticipatingEvents(userID uint) ([]models.Event, error) {
	var events []models.Event

	err := r.db.
		Distinct().
		Joins("JOIN participates ON participates.event_id = events.id").
		Where("participates.user_id = ? AND participates.status = ?", userID, "accepted").
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "name", "username", "profile_picture")
		}).
		Find(&events).Error

	return events, err
}
func (r *Repository) RemoveParticipation(eventID uint, userID uint) error {
	return r.db.Where("event_id = ? AND user_id = ?", eventID, userID).Delete(&models.Participate{}).Error
}
