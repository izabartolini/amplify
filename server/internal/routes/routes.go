package routes

import (
	"amplify/server/config"
	"amplify/server/internal/controllers"
	"amplify/server/internal/repositories"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {

	repository := repositories.NewRepository(config.DB)

	controller := controllers.NewHandler(repository)

	r.GET("/user", controller.GetUsers)
	r.POST("/createUser", controller.CreateUsers)
}
