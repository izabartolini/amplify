package models

import (
	"time"
)

type Tag struct{
	ID             uint           `gorm:"primaryKey;autoIncrement:true;<-:create(false)"`
	Name           string		  `gorm:"not null;unique"`
	CreatedAt      time.Time      `gorm:"autoCreateTime"`

	UserTag     []UserTag         `gorm:"foreignKey:TagID;constraint:OnDelete:CASCADE;"`
	EventTag    []EventTag        `gorm:"foreignKey:TagID;constraint:OnDelete:CASCADE;"`
	PostTag     []PostTag         `gorm:"foreignKey:TagID;constraint:OnDelete:CASCADE;"`
}

type UserTag struct{
	ID             uint           `gorm:"primaryKey;autoIncrement:true;<-:create(false)"`
	UserID         uint           `gorm:"not null"` 
	TagID          uint           `gorm:"not null"`
}

type EventTag struct{
	ID             uint           `gorm:"primaryKey;autoIncrement:true;<-:create(false)"`
	EventID        uint           `gorm:"not null"` 
	TagID          uint           `gorm:"not null"`
}

type PostTag struct{
	ID             uint           `gorm:"primaryKey;autoIncrement:true;<-:create(false)"`
	PostID         uint           `gorm:"not null"` 
	TagID          uint           `gorm:"not null"`
}