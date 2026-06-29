package controllers

import (
	"net/http"
	"amplify/server/internal/repositories"
	"github.com/gin-gonic/gin"
)

type InstrumentController struct {
	repo *repositories.InstrumentRepository
}

func NewInstrumentController(repo *repositories.InstrumentRepository) *InstrumentController {
	return &InstrumentController{repo: repo}
}

func (h *InstrumentController) GetInstruments(c *gin.Context) {
	search := c.Query("name")

	instruments, err := h.repo.GetAllInstruments(search)
	if err != nil {
		c.JSON(400, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, instruments)
}

