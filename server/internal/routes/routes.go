package routes

import (
	"amplify/server/config"
	"amplify/server/internal/controllers"
	"amplify/server/internal/middlewares"
	"amplify/server/internal/repositories"
	"amplify/server/internal/services"
	"net/http"

	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	repository := repositories.NewRepository(config.DB)
	service := services.NewService(repository)
	controller := controllers.NewHandler(service)
	instrumentRepository :=repositories.NewInstrumentRepository(config.DB)
	instrumentController := controllers.NewInstrumentController(instrumentRepository)
	tagRepository :=repositories.NewTagRepository(config.DB)
	tagController := controllers.NewTagController(tagRepository)


	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders: []string{"Origin", "Content-Type", "Authorization"},
	}))

	r.GET("/user", controller.GetUsers)
	r.GET("/userByName", controller.GetUsersByName)
	r.POST("/login", controller.Login)
	r.POST("/forgot-password", controller.ForgotPassword)
	r.POST("/forgot-password/new-password", controller.ValidateCod)

	publicAPI := r.Group("/api/auth")
	{
		publicAPI.POST("/register", controller.Register)
		publicAPI.GET("/instruments", instrumentController.GetInstruments)	
		publicAPI.GET("/tags", tagController.GetTag)	
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

		usersAPI := protectedAPI.Group("/users")
		{
			usersAPI.GET("/:id", controller.GetUserByID)
			usersAPI.PUT("/update", controller.UpdateUser)
			usersAPI.PUT("/update/security", controller.UpdateUserPassword)
			usersAPI.GET("/:id/activity", controller.GetUserActivity)
			usersAPI.GET("/:id/posts", controller.GetUserPosts)
			usersAPI.GET("/:id/events", controller.GetUserEvents)
			usersAPI.DELETE("/me", controller.DeleteMe)
			usersAPI.POST("/:id/follow", controller.FollowUser)
			usersAPI.DELETE("/:id/follow", controller.UnfollowUser)
			usersAPI.GET("/:id/follow", controller.IsFollowing)
		}

		postsAPI := protectedAPI.Group("/posts")
		{
			postsAPI.POST("", controller.CreatePost)
			postsAPI.GET("", controller.GetFeed)
			postsAPI.GET("/:id", controller.GetPostByID)
			postsAPI.POST("/:id/like", controller.LikePost)
			postsAPI.DELETE("/:id/like", controller.UnlikePost)
			postsAPI.POST("/:id/comments", controller.CreateComment)
			postsAPI.DELETE("/:id/comments/:commentId", controller.DeleteComment)
		}

		eventsAPI := protectedAPI.Group("/events")
		{
			eventsAPI.POST("", controller.CreateEvent)
			eventsAPI.GET("/:id", controller.GetEvent)
			eventsAPI.GET("/:id/requests", controller.GetEventRequests)
			eventsAPI.POST("/:id/requests", controller.RequestParticipation)
			eventsAPI.POST("/:id/invites", controller.InviteUser)
			eventsAPI.PUT("/:id/update", controller.UpdateEvent)
			eventsAPI.DELETE("/:id/delete", controller.DeleteEvent)
		}

		//future protected routes
	}
}
