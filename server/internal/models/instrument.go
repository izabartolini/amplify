
package models

import(

)

type Instrument struct{
	ID             uint                   `gorm:"primaryKey;autoIncrement:true;<-:create(false)"`
	Name           string                 `gorm:"not null"`

	PlayedBy       []UserInstrument       `gorm:"foreignKey:InstrumentID"`
}

type UserInstrument struct{
	ID             uint          `gorm:"primaryKey;autoIncrement:true;<-:create(false)"`
	InstrumentID   uint          `gorm:"not null"`
	UserID         uint          `gorm:"not null"`
	Level		   string   	 `gorm:"not null"`
}