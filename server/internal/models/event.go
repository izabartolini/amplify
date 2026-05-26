package models

import (
	"time"
	"gorm.io/gorm"
)

type Event struct {
	ID          uint           `gorm:"primaryKey"`
	UserID      uint           `gorm:"not null"`
	Name        string         `gorm:"not null"`
	Description string
	Date        time.Time     `gorm:"not null"`
	IsPrivate   bool           `gorm:"default:false"`
	Place       string
	City        string
	State       string
	Country     string
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   gorm.DeletedAt `gorm:"index"`

	Medias      []Media        `gorm:"foreignKey:EventID;constraint:OnDelete:CASCADE;"`
	Participants []Participate `gorm:"foreignKey:EventID;constraint:OnDelete:CASCADE;"`
}

type Participate struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"not null"`
	EventID   uint      `gorm:"not null"`
	Joined    time.Time `gorm:"autoCreateTime"`
	Left      *time.Time
}