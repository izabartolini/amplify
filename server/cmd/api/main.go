package main

import (
	"amplify/server/config"
	"amplify/server/internal/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	config.ConnectDatabase()

	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})
	
	routes.SetupRoutes(r)

	r.Run(":8080")
}