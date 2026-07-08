package models

import (
	"time"

	"gorm.io/gorm"
)

type Notification struct {
	ID          uint           `gorm:"primaryKey;autoIncrement:true;<-:create(false)" json:"id"`
	RecipientID uint           `gorm:"not null;index" json:"recipient_id"`
	ActorID     uint           `gorm:"not null" json:"actor_id"`
	Type        string         `gorm:"not null" json:"type"`
	PostID      *uint          `json:"post_id"`
	Read        bool           `gorm:"not null;default:false" json:"read"`
	CreatedAt   time.Time      `gorm:"autoCreateTime" json:"created_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	Recipient User  `gorm:"foreignKey:RecipientID" json:"-"`
	Actor     User  `gorm:"foreignKey:ActorID" json:"actor"`
	Post      *Post `gorm:"foreignKey:PostID" json:"post,omitempty"`
}
