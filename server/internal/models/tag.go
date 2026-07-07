package models

import (
	"time"
)

type Tag struct {
	ID        uint      `gorm:"primaryKey;autoIncrement:true;<-:create(false)"`
	Name      string    `gorm:"not null;unique"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"-"`

	UserTag  []UserTag  `gorm:"foreignKey:TagID;constraint:OnDelete:CASCADE;" json:"-"`
	EventTag []EventTag `gorm:"foreignKey:TagID;constraint:OnDelete:CASCADE;" json:"-"`
	PostTag  []PostTag  `gorm:"foreignKey:TagID;constraint:OnDelete:CASCADE;" json:"-"`
}

type UserTag struct {
	ID     uint `gorm:"primaryKey;autoIncrement:true;<-:create(false)"`
	UserID uint `gorm:"not null"`
	TagID  uint `gorm:"not null"`
	Tag    Tag  `gorm:"foreignKey:TagID"`
}

type EventTag struct {
	ID      uint `gorm:"primaryKey;autoIncrement:true;<-:create(false)"`
	EventID uint `gorm:"not null"`
	TagID   uint `gorm:"not null"`
}

type PostTag struct {
	ID     uint `gorm:"primaryKey;autoIncrement:true;<-:create(false)"`
	PostID uint `gorm:"not null"`
	TagID  uint `gorm:"not null"`
}
