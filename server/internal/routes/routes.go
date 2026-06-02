package routes

import (
	"amplify/server/config"
	"amplify/server/internal/controllers"
	"amplify/server/internal/repositories"
	"amplify/server/internal/services" // Import do novo pacote

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	repository := repositories.NewRepository(config.DB)

	userService := services.NewUserService(repository)

	controller := controllers.NewHandler(repository, userService)

	r.GET("/user", controller.GetUsers)
	r.POST("/createUser", controller.CreateUsers)

	api := r.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", controller.Register)
		}
	}
}
