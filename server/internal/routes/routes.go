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
	r.POST("/forgot-password", controller.ForgotPassword)
	r.POST("/forgot-password/new-password", controller.ValidateCod)

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

		protectedAPI.PUT("/users/update", controller.UpdateUser)
		protectedAPI.GET("/users/:id/activity", controller.GetUserActivity)
		protectedAPI.DELETE("/me", controller.DeleteMe)
		protectedAPI.PUT("/users/update/security", controller.UpdateUserPassword)

		protectedAPI.POST("/posts", controller.CreatePost)
		eventsAPI := protectedAPI.Group("/events")
		{
			eventsAPI.POST("", controller.CreateEvent)

			eventsAPI.POST("/:id/requests", controller.RequestParticipation)

			eventsAPI.POST("/:id/invites", controller.InviteUser)

			eventsAPI.GET("/:id", controller.GetEvent)

			eventsAPI.GET("/:id/requests", controller.GetEventRequests)

			eventsAPI.PUT("/:id/update", controller.UpdateEvent)

			eventsAPI.DELETE("/:id/delete", controller.DeleteEvent)
        }
		
		//future protected routes
	}
}
