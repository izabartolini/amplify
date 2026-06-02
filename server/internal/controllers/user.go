package controllers

import (
	"net/http"
	"strings"

	"amplify/server/internal/models"
	"amplify/server/internal/repositories"
	"amplify/server/internal/services" 

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

func (h *Controller) CreateUsers(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.PostUser(&user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, user)
}

func (h *Controller) Register(c *gin.Context) {
	var req services.RegisterDTO

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Campos obrigatórios ausentes ou payload JSON inválido"})
		return
	}

	user, err := h.UserService.RegisterUser(req)
	if err != nil {
		if strings.Contains(err.Error(), "já cadastrados") {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user.Password = ""

	c.JSON(http.StatusCreated, gin.H{
		"message": "Usuário criado com sucesso",
		"user":    user,
	})

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

func (h *Controller) GetUsersByName(c *gin.Context) {
	users, err := h.service.GetUsersByName(c.Query("name"))
	if err != nil {
		c.JSON(500, gin.H{
			"erro": err.Error(),
		})
		return
	}

	c.JSON(200, users)
}