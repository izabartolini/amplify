package repositories

import (
    "amplify/server/internal/models"
    "gorm.io/gorm"
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
    err := r.db.Preload("Medias").
              Preload("Participants").
              Preload("Tag").
              First(&event, id).Error

    return &event, err
}
func (r *Repository) GetPendingRequests(eventID uint) ([]models.Participate, error){
    var participation []models.Participate
    err := r.db.Where("event_id = ? AND status = ?", eventID, "pending").Find(&participation).Error
    return participation, err 
}
func (r *Repository) UpdateEvent(event *models.Event) error {
    return r.db.Save(event).Error
}