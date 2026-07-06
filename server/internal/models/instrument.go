package models

import "time"

type Instrument struct{
	ID             uint                   `gorm:"primaryKey;autoIncrement:true;<-:create(false)"`
	Name            string                `gorm:"not null;unique"`
	CreatedAt       time.Time             `gorm:"autoCreateTime" json:"-"`

	PlayedBy       []UserInstrument       `gorm:"foreignKey:InstrumentID" json:"-"`
}

type UserInstrument struct{
	ID             uint          `gorm:"primaryKey;autoIncrement:true;<-:create(false)"`
	InstrumentID   uint          `gorm:"not null"`
	UserID         uint          `gorm:"not null"`
	Level		   uint8   	     `gorm:"not null"`
}