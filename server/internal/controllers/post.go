package controllers

import (
	"amplify/server/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Controller) CreatePost(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "não autenticado"})
		return
	}

	var req services.CreatePostDTO
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "payload inválido"})
		return
	}

	post, err := h.service.CreatePost(userID.(uint), req)
	if err != nil {
		if err.Error() == "máximo de 5 mídias por post" || err.Error() == "tipo de mídia inválido, use 'photo' ou 'video'" {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, post)
}

func (h *Controller) GetFeed(c *gin.Context) {
	posts, err := h.service.GetFeed()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, posts)
}
