package routes

import (
	"amplify/server/config"
	"amplify/server/internal/controllers"
	"amplify/server/internal/repositories"
	"amplify/server/internal/services"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	r.POST("/createUser", controller.CreateUsers)

	api := r.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", controller.Register)
		}
	}

	repository := repositories.NewRepository(config.DB)
	service := services.NewService(repository)
	controller := controllers.NewHandler(service)

	r.GET("/user", controller.GetUsers)
	r.GET("/userByName", controller.GetUsersByName)
	r.POST("/Login", controller.Login)
}
