package models

type Media struct {
	ID    uint   `gorm:"primaryKey;autoIncrement:true;<-:create(false)" json:"id"`
	Url   string `gorm:"not null" json:"url"`
	Type  string `gorm:"not null" json:"type"`
	Order int    `gorm:"not null" json:"order"`

	PostID  *uint `gorm:"default:null" json:"post_id"`
	EventID *uint `gorm:"default:null" json:"event_id"`
}
