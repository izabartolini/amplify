package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID             uint   `gorm:"primaryKey;autoIncrement:true;<-:create(false)"`
	Name           string `gorm:"not null"`
	Email          string `gorm:"unique;not null"`
	Username       string `gorm:"unique;not null"`
	Password       string `gorm:"not null;not null"`
	ProfilePicture string
	CPF            string `gorm:"unique;not null"`
	Bio            string
	Instrument     string
	Level          string
	City           string
	State          string
	Country        string
	CreatedAt      time.Time      `gorm:"autoCreateTime"`
	UpdatedAt      time.Time      `gorm:"autoUpdateTime"`
	DeletedAt      gorm.DeletedAt `gorm:"index"`

	Posts        []Post        `gorm:"foreignKey:UserID"`
	Events       []Event       `gorm:"foreignKey:UserID"`
	Likes        []Like        `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;"`
	Comments     []Comment     `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;"`
	Following    []Follow      `gorm:"foreignKey:FollowerID;constraint:OnDelete:CASCADE;"`
	Followers    []Follow      `gorm:"foreignKey:FollowingID;constraint:OnDelete:CASCADE;"`
	Participants []Participate `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;"`
}

type Follow struct {
	ID          uint           `gorm:"primaryKey;autoIncrement:true;<-:create(false)"`
	FollowerID  uint           `gorm:"not null"`
	FollowingID uint           `gorm:"not null"`
	CreatedAt   time.Time      `gorm:"autoCreateTime"`
	DeletedAt   gorm.DeletedAt `gorm:"index"`
}