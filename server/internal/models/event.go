package models

import (
	"time"

	"gorm.io/gorm"
)

type Event struct {
	ID           uint   `gorm:"primaryKey;autoIncrement:true;<-:create(false)"`
	UserID       uint   `gorm:"not null"`
	Name         string `gorm:"not null"`
	Description  string
	Date         time.Time `gorm:"not null"`
	IsPrivate    bool      `gorm:"default:false"`
	Place        string
	City         string
	State        string
	Country      string
	CreatedAt    time.Time      `gorm:"autoCreateTime"`
	UpdatedAt    time.Time      `gorm:"autoUpdateTime"`
	DeletedAt    gorm.DeletedAt `gorm:"index"`
	User         User           `gorm:"foreignKey:UserID"`
	Medias       []Media        `gorm:"foreignKey:EventID;constraint:OnDelete:CASCADE;"`
	Participants []Participate  `gorm:"foreignKey:EventID;constraint:OnDelete:CASCADE;"`
	Tag          []EventTag     `gorm:"foreignKey:EventID;constraint:OnDelete:CASCADE;"`
}

type Participate struct {
	ID      uint      `gorm:"primaryKey;autoIncrement:true;<-:create(false)"`
	UserID  uint      `gorm:"not null"`
	EventID uint      `gorm:"not null"`
	Status  string    `gorm:"type:varchar(20);not null;default:'accepted'"`
	Joined  time.Time `gorm:"autoCreateTime"`
	Left    *time.Time
}
