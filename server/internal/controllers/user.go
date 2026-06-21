package controllers

import (
	"fmt"
	"net/http"
	"strings"

	"amplify/server/internal/services"

	"github.com/gin-gonic/gin"
)

type Controller struct {
	service *services.Service
}

func NewHandler(service *services.Service) *Controller {
	return &Controller{
		service: service,
	}
}

func (h *Controller) Register(c *gin.Context) {
	var req services.RegisterDTO

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Campos obrigatórios ausentes ou payload JSON inválido"})
		return
	}

	user, err := h.service.RegisterUser(req)
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

func (h *Controller) UpdateUser(c *gin.Context) {

	var req services.UpdateUserRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	userID, exists := c.Get("userID")

	if !exists {
		c.JSON(401, gin.H{
			"error": "unauthorized",
		})
		return
	}

	err := h.service.UpdateUserProfile(
		userID.(uint),
		req,
	)

	if err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "profile updated successfully",
	})
}
func (h *Controller) DeleteMe(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	id := userID.(uint)

	if err := h.service.DeleteUserAccount(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao deletar conta"})
		return
	}

	c.Status(http.StatusNoContent)
}

func (h *Controller) UpdateUserPassword(c *gin.Context) {

	var reqPassword services.UpdateUserPasswordRequest

	if err := c.ShouldBindJSON(&reqPassword); err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	userID, exists := c.Get("userID")

	if !exists {
		c.JSON(401, gin.H{
			"error": "unauthorized",
		})
		return
	}

	err := h.service.UpdateUserPassword(
		userID.(uint),
		reqPassword,
	)

	if err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "profile updated successfully",
	})
}

type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email"`
}

func (h *Controller) ForgotPassword(c *gin.Context) {

	var req ForgotPasswordRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	err := h.service.SendResetPasswordEmail(
		req.Email,
	)

	if err != nil {
		fmt.Println("SMTP ERROR:", err)
		c.JSON(500, gin.H{"error": "failed to send email"})
		return
	}

	c.JSON(200, gin.H{
		"message": "email sent",
	})
}

func (h *Controller) ValidateCod(c *gin.Context) {
	var req struct {
		Email string `json:"email"`
		Code  string `json:"code"`
		services.UpdateForgotenPasswordRequest
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	id, err := h.service.VerifyResetCode(req.Email, req.Code)

	if err != nil {
		c.JSON(401, gin.H{
			"error": err.Error(),
		})
		return
	}
	err = h.service.UpdateForgotenPassword(id, req.UpdateForgotenPasswordRequest)
	if err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "password updated successfully",
		"user":    id,
	})
}
