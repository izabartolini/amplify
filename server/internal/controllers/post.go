package controllers

import (
	"amplify/server/internal/services"
	"net/http"
	"strconv"

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

func (h *Controller) GetPostByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	post, err := h.service.GetPostByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, post)
}

func (h *Controller) LikePost(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "não autenticado"})
		return
	}

	idStr := c.Param("id")
	postID, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	err = h.service.LikePost(userID.(uint), uint(postID))
	if err != nil {
		if err.Error() == "post não encontrado" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		if err.Error() == "usuário já curtiu este post" {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "post curtido com sucesso"})
}

func (h *Controller) UnlikePost(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "não autenticado"})
		return
	}

	idStr := c.Param("id")
	postID, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	err = h.service.UnlikePost(userID.(uint), uint(postID))
	if err != nil {
		if err.Error() == "post não encontrado" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		if err.Error() == "curtida não encontrada" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "curtida removida com sucesso"})
}

func (h *Controller) CreateComment(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "não autenticado"})
		return
	}

	idStr := c.Param("id")
	postID, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	var req services.CreateCommentDTO
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "payload inválido"})
		return
	}

	comment, err := h.service.CreateComment(userID.(uint), uint(postID), req)
	if err != nil {
		if err.Error() == "post não encontrado" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		if err.Error() == "comentário não pode ser vazio" || err.Error() == "comentário não pode ter mais de 200 caracteres" {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, comment)
}
