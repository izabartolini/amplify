package utils

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateToken(userID uint, email string) (string, error) {
	secretKey := os.Getenv("JWT_SECRET")

	claims := jwt.MapClaims{
		"sub":   userID,                                 
		"email": email,                                 
		"exp":   time.Now().Add(time.Hour * 48).Unix(), 
		"iat":   time.Now().Unix(),                     
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}