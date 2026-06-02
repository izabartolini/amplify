package controllers

import (
	"net/http"
	"strings"

	"amplify/server/internal/models"
	"amplify/server/internal/repositories"
	"amplify/server/internal/services" // Import do novo pacote

	"github.com/gin-gonic/gin"
)

type Handler struct {
	Repo        *repositories.Repository
	UserService *services.UserService // Adicionamos o service aqui
}

func NewHandler(repo *repositories.Repository, userService *services.UserService) *Handler {
	return &Handler{
		Repo:        repo,
		UserService: userService,
	}
}

func (h *Handler) GetUsers(c *gin.Context) {
	users, err := h.Repo.GetUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}

func (h *Handler) CreateUsers(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.Repo.PostUser(&user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, user)
}

func (h *Handler) Register(c *gin.Context) {
	// Puxa o DTO que agora mora no pacote services
	var req services.RegisterDTO

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Campos obrigatórios ausentes ou payload JSON inválido"})
		return
	}

	// Entrega para a camada de Serviço processar a regra de negócio
	user, err := h.UserService.RegisterUser(req)
	if err != nil {
		// Se o erro for de unicidade, retorna 409 Conflict
		if strings.Contains(err.Error(), "já cadastrados") {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		// Qualquer outro erro de validação (senha, username, etc) retorna 400 Bad Request
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user.Password = "" // Ocultar no retorno

	c.JSON(http.StatusCreated, gin.H{
		"message": "Usuário criado com sucesso",
		"user":    user,
	})
}