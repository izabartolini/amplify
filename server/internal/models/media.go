package models

type Media struct {
	ID      uint   `gorm:"primaryKey"`
	Url     string `gorm:"not null"`
	Type    string `gorm:"not null"` 
	Order   int    `gorm:"not null"`

	PostID  *uint  `gorm:"default:null"`
	EventID *uint  `gorm:"default:null"` 
}