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