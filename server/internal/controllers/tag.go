package controllers

import (
	"net/http"
	"amplify/server/internal/repositories"
	"github.com/gin-gonic/gin"
)

type TagController struct {
	repo *repositories.TagRepository
}

func NewTagController(repo *repositories.TagRepository) *TagController {
	return &TagController{repo: repo}
}

func (h *TagController) GetTag(c *gin.Context) {
	search := c.Query("name")

	tag, err := h.repo.GetAllTags(search)
	if err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, tag)
}

