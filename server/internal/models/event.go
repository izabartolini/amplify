package models

import (
	"time"

	"gorm.io/gorm"
)

type Event struct {
	ID          uint           `gorm:"primaryKey;autoIncrement:true;<-:create(false)" json:"id"`
	UserID      uint           `gorm:"not null" json:"user_id"`
	Name        string         `gorm:"not null" json:"name"`
	Description string         `json:"description"`
	Date        time.Time      `gorm:"not null" json:"date"`
	IsPrivate   bool           `gorm:"default:false" json:"is_private"`
	Place       string         `json:"place"`
	City        string         `json:"city"`
	State       string         `json:"state"`
	Country     string         `json:"country"`
	CreatedAt   time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time      `gorm:"autoUpdateTime" json:"-"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	User User `gorm:"foreignKey:UserID" json:"organizer"`

	Medias       []Media       `gorm:"foreignKey:EventID;constraint:OnDelete:CASCADE;" json:"medias"`
	Participants []Participate `gorm:"foreignKey:EventID;constraint:OnDelete:CASCADE;" json:"participants"`
	Tag          []EventTag    `gorm:"foreignKey:EventID;constraint:OnDelete:CASCADE;" json:"tags"`
}

type Participate struct {
	ID      uint       `gorm:"primaryKey;autoIncrement:true;<-:create(false)" json:"id"`
	UserID  uint       `gorm:"not null" json:"user_id"`
	EventID uint       `gorm:"not null" json:"event_id"`
	Status  string     `gorm:"type:varchar(20);not null;default:'accepted'" json:"status"`
	Joined  time.Time  `gorm:"autoCreateTime" json:"joined"`
	Left    *time.Time `json:"left"`
}
