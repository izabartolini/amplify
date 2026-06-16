package config

import (
	"fmt"
	"log"
	"os"

	"amplify/server/internal/models"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Missing .env file")
	}

	dbHost := os.Getenv("DB_HOST")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbPort := os.Getenv("DB_PORT")

	if dbHost == "" || dbPort == "" || dbUser == "" || dbName == "" {
		log.Fatal("Missing env")
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=America/Sao_Paulo",
		dbHost, dbUser, dbPassword, dbName, dbPort,
	)

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Fail while connecting with database:", err)
	}

	log.Println("Connection with database successful!")

	log.Println("Migrating...")
	
	err = database.AutoMigrate(
		&models.User{},
    &models.Follow{},
    &models.Post{},
    &models.Media{},
    &models.Like{},
    &models.Comment{},
    &models.Event{},
    &models.Participate{},
    &models.Tag{},     
    &models.UserTag{}, 
    &models.EventTag{},
    &models.PostTag{},
    &models.Instrument{},
    &models.UserInstrument{},
	)

	if err != nil {
		log.Fatal("Fail while automigrating:", err)
	}

	log.Println("Migration successful!")

	DB = database
}