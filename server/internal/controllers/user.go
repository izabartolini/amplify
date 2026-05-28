package controllers

import (
	"net/http"
	"regexp"

	"amplify/server/internal/models"
	"amplify/server/internal/repositories"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// Handler gerencia todas as requisições relacionadas ao Usuário
type Handler struct {
	Repo *repositories.Repository
}

func NewHandler(repo *repositories.Repository) *Handler {
	return &Handler{Repo: repo}
}

var (
	usernameRegex = regexp.MustCompile(`^[a-zA-Z0-9_;.]+$`)
	passwordRegex = regexp.MustCompile(`^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$`)
)

type RegisterRequest struct {
	Name           string `json:"name" binding:"required"`
	Email          string `json:"email" binding:"required,email"`
	Username       string `json:"username" binding:"required"`
	Password       string `json:"password" binding:"required"`
	CPF            string `json:"cpf" binding:"required"`
	Instrument     string `json:"instrument"`
	Level          string `json:"level"`
	City           string `json:"city"`
	State          string `json:"state"`
	Country        string `json:"country"`
	Bio            string `json:"bio"`
	ProfilePicture string `json:"profile_picture"`
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
	var req RegisterRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Campos obrigatórios ausentes ou payload JSON inválido"})
		return
	}

	if !usernameRegex.MatchString(req.Username) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Usuário inválido. Utilize apenas letras, números e ( _ ; . )"})
		return
	}
	if !passwordRegex.MatchString(req.Password) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "A senha deve conter 8 caracteres, letras maiúsculas, minúsculas e caractere especial"})
		return
	}

	if err := h.Repo.CheckConflicts(req.Email, req.Username, req.CPF); err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro interno ao processar a senha"})
		return
	}

	user := models.User{
		Name:           req.Name,
		Email:          req.Email,
		Username:       req.Username,
		Password:       string(hashedPassword),
		CPF:            req.CPF,
		Instrument:     req.Instrument,
		Level:          req.Level,
		City:           req.City,
		State:          req.State,
		Country:        req.Country,
		Bio:            req.Bio,
		ProfilePicture: req.ProfilePicture,
	}

	if err := h.Repo.PostUser(&user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao registrar usuário no banco de dados"})
		return
	}

	user.Password = "" // Ocultar no retorno

	c.JSON(http.StatusCreated, gin.H{
		"message": "Usuário criado com sucesso",
		"user":    user,
	})
}
