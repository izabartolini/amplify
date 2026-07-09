package controllers

import (
	"github.com/gin-gonic/gin"
)

func (h *Controller) Login(c *gin.Context) {

	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{
			"error": "Campos obrigatórios ausentes ou payload JSON inválido",
		})
		return
	}

	token, err := h.service.Login(req.Email, req.Password)

	if err != nil {
		switch err.Error() {

		case "user_not_found":
			c.JSON(401, gin.H{
				"field":   "email",
				"message": "Usuário não encontrado",
			})

		case "invalid_password":
			c.JSON(401, gin.H{
				"field":   "password",
				"message": "Senha incorreta",
			})

		default:
			c.JSON(500, gin.H{
				"message": "Erro interno do servidor",
			})
		}

		return
	}
	c.JSON(200, gin.H{
		"token": token,
	})
}
