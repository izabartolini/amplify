package routes

import (
	"amplify/server/config"
	"amplify/server/internal/controllers"
	"amplify/server/internal/middlewares"
	"amplify/server/internal/repositories"
	"amplify/server/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	repository := repositories.NewRepository(config.DB)
	service := services.NewService(repository)
	controller := controllers.NewHandler(service)

	r.GET("/user", controller.GetUsers)
	r.GET("/userByName", controller.GetUsersByName)
	r.POST("/login", controller.Login)

	publicAPI := r.Group("/api/auth")
	{
		publicAPI.POST("/register", controller.Register)
	}

	protectedAPI := r.Group("/api")
	protectedAPI.Use(middlewares.AuthRequired()) 
	{
		protectedAPI.GET("/test-auth", func(c *gin.Context) {
			userID, _ := c.Get("userID") 
			
			c.JSON(http.StatusOK, gin.H{
				"message":        "Funcionando...",
				"user_id_logado": userID,
			})
		})

		//future protected routes
	}
}
