package controllers

import(
	"amplify/server/internal/repositories"
	"amplify/server/internal/models"
	"github.com/gin-gonic/gin"

)
type Controller struct {
	repository *repositories.Repository

}

func NewHandler(repository *repositories.Repository) *Controller {
	return &Controller{
		repository: repository,
	}
}

func (h *Controller) GetUsers(c *gin.Context) {
	users, err := h.repository.GetUsers()

	if err != nil {
		c.JSON(500, gin.H{
			"erro": err.Error(),
		})
		return
	}

	c.JSON(200, users)
}

func (h *Controller) CreateUsers(c *gin.Context) {
	var user models.User

	err := c.ShouldBindJSON(&user)

	if err != nil {
		c.JSON(400, gin.H{
			"erro": err.Error(),
		})
		return
	}

	err = h.repository.PostUser(&user)
	if err != nil {
		c.JSON(500, gin.H{
			"erro": err.Error(),
		})
		return
	}

	c.JSON(201, "user created!")
}
