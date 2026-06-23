package models

import (
	"time"

	"gorm.io/gorm"
)

type Post struct {
	ID        uint `gorm:"primaryKey;autoIncrement:true;<-:create(false)"`
	UserID    uint `gorm:"not null"`
	Subtitle  string
	CreatedAt time.Time      `gorm:"autoCreateTime"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `gorm:"index"`
	User      User           `gorm:"foreignKey:UserID"`
	Medias    []Media        `gorm:"foreignKey:PostID;constraint:OnDelete:CASCADE;"`
	Likes     []Like         `gorm:"foreignKey:PostID;constraint:OnDelete:CASCADE;"`
	Comments  []Comment      `gorm:"foreignKey:PostID;constraint:OnDelete:CASCADE;"`
	Tag       []PostTag      `gorm:"foreignKey:PostID;constraint:OnDelete:CASCADE;"`
}

type Like struct {
	ID        uint      `gorm:"primaryKey;autoIncrement:true;<-:create(false)"`
	UserID    uint      `gorm:"not null"`
	PostID    uint      `gorm:"not null"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
}

type Comment struct {
	ID        uint           `gorm:"primaryKey;autoIncrement:true;<-:create(false)" json:"id"`
	UserID    uint           `gorm:"not null" json:"user_id"`
	PostID    uint           `gorm:"not null" json:"post_id"`
	Text      string         `gorm:"not null" json:"text"`
	CreatedAt time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
