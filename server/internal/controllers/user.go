package controllers

import(
	"amplify/server/internal/repositories"
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

func (h *Controller) GetUsersByName(c *gin.Context){
	users, err := h.repository.GetUsersByName(c.Query("name"))
	if err != nil {
		c.JSON(500, gin.H{
			"erro": err.Error(),
		})
		return
	}

	c.JSON(200, users)
}