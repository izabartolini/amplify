package controllers

import (
	service "amplify/server/internal/services"

	"github.com/gin-gonic/gin"
)
type Controller struct {
	service *service.Service
}

func NewHandler(service *service.Service) *Controller {
	return &Controller{
		service: service,
	}
}



func (h *Controller) GetUsers(c *gin.Context) {
	users, err := h.service.GetUsers()

	if err != nil {
		c.JSON(500, gin.H{
			"erro": err.Error(),
		})
		return
	}

	c.JSON(200, users)
}

func (h *Controller) GetUsersByName(c *gin.Context){
	users, err := h.service.GetUsersByName(c.Query("name"))
	if err != nil {
		c.JSON(500, gin.H{
			"erro": err.Error(),
		})
		return
	}

	c.JSON(200, users)
}