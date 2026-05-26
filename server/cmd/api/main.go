package main

import (
	"amplify/server/config"
	"github.com/gin-gonic/gin"        
)

func main() {
	config.ConnectDatabase()

	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})
	
	r.Run(":8080")
}