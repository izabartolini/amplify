package controllers

import (
    "net/http"
    "strconv"
    "amplify/server/internal/services"
    "github.com/gin-gonic/gin"
)

func (c *Controller) CreateEvent(ctx *gin.Context) {
    var req services.CreateEventRequest 
    
    if err := ctx.ShouldBindJSON(&req); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos: " + err.Error()})
        return
    }

    userID := ctx.GetUint("userID") 

    event, err := c.service.CreateEvent(req, userID)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao criar o evento"})
        return
    }

    ctx.JSON(http.StatusCreated, event)
}

func (c *Controller) RequestParticipation(ctx *gin.Context) {
    eventIDStr := ctx.Param("id")
    eventID, _ := strconv.ParseUint(eventIDStr, 10, 32)
    userID := ctx.GetUint("userID")

    err := c.service.RequestParticipation(uint(eventID), userID)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao processar solicitação"})
        return
    }

    ctx.JSON(http.StatusCreated, gin.H{"message": "Solicitação enviada com sucesso"})
}
func (c *Controller) InviteUser(ctx *gin.Context) {
    eventIDStr := ctx.Param("id")
    eventID, _ := strconv.ParseUint(eventIDStr, 10, 32)
    
    var req struct {
        UserID uint `json:"user_id"`
    }
    if err := ctx.ShouldBindJSON(&req); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID do usuário inválido"})
        return
    }

    err := c.service.InviteUser(uint(eventID), req.UserID)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao enviar convite"})
        return
    }

    ctx.JSON(http.StatusCreated, gin.H{"message": "Convite enviado com sucesso"})
}
func (c *Controller) GetEvent(ctx *gin.Context ){
    eventIDStr := ctx.Param("id")
    eventID, err := strconv.ParseUint(eventIDStr, 10, 20)
    if err!= nil {
    ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID do evento invalido"})
    return
    }

    event, err := c.service.GetEvent(uint(eventID))
    if err != nil {
        ctx.JSON(http.StatusNotFound, gin.H{"error": "Evento nao encontrado"})
        return
    }
    ctx.JSON(http.StatusOK, event)

}
func (c *Controller) GetEventRequests(ctx *gin.Context) {
    eventIDStr := ctx.Param("id")
    eventID, err := strconv.ParseUint(eventIDStr,10,32)
    if err != nil{
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "id invalido"})
        return
    }

    userIDInterface, exists := ctx.Get("userID")
    if !exists{
        ctx.JSON(http.StatusUnauthorized, gin.H{"error":"Usuario nao autenticado"})
        return
    }
    userID := userIDInterface.(uint)

    requests, err := c.service.GetEventRequests(uint(eventID), userID)
    if err != nil {
        ctx.JSON(http.StatusForbidden, gin.H{"error":"Nao e o dono do evento"})
        return
    }
    ctx.JSON(http.StatusOK, requests)
}