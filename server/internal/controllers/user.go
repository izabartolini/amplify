package controllers

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"amplify/server/internal/services"
	"amplify/server/internal/utils"

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
// UpdateUserForm mapeia os campos vindos do FormData do React
type UpdateUserForm struct {
	Name           string `form:"name"`
	Username       string `form:"username"`
	Bio            string `form:"bio"`
	City           string `form:"city"`
	State          string `form:"state"`
	Country        string `form:"country"`
	CPF            string `form:"cpf"`
	TagsRaw        string `form:"tags"`
	InstrumentsRaw string `form:"instruments"`
}

type InstrumentData struct {
	Nome  string `json:"nome"`
	Nivel int    `json:"nivel"`
}

type UpdateUserDTO struct {
	Name           string
	Username       string
	Bio            string
	City           string
	State          string
	Country        string
	CPF            string
	ProfilePicture string
	Tags           []string
	Instruments    []InstrumentData
}

func (h *Controller) UpdateUserProfile(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "usuário não autenticado"})
		return
	}

	var form UpdateUserForm
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Campos inválidos"})
		return
	}

	if form.Name == "" || form.Username == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nome e Username são obrigatórios"})
		return
	}

	var profilePictureURL string
	file, err := c.FormFile("image")
	if err == nil && file != nil {
		uploadedURL, uploadErr := utils.UploadToDrive(file)
		if uploadErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao subir imagem"})
			return
		}
		profilePictureURL = uploadedURL
	}

	err = h.service.UpdateUserProfile(
		userID.(uint), 
		form.Name, 
		form.Username, 
		form.Bio, 
		form.City, 
		form.State, 
		form.Country, 
		form.CPF, 
		profilePictureURL, 
		form.TagsRaw, 
		form.InstrumentsRaw,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":         "perfil atualizado com sucesso",
		"profileImageUrl": profilePictureURL,
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
		switch err.Error() {

		case "password_invalid":
			c.JSON(400, gin.H{
				"field":   "password",
				"message": "A nova senha deve conter 8 caracteres, letras maiúsculas, minúsculas e caractere especial.",
			})

		case "A nova senha deve conter 8 caracteres, letras maiúsculas, minúsculas e caractere especial":
			c.JSON(400, gin.H{
				"field":   "password",
				"message": "A nova senha deve conter 8 caracteres, letras maiúsculas, minúsculas e caractere especial.",
			})
		case "passwords_do_not_match":
			c.JSON(400, gin.H{
				"field":   "confirmPassword",
				"message": "As senhas não são iguais.",
			})

		default:
			c.JSON(500, gin.H{
				"message": "Erro interno do servidor",
			})
		}
		return
	}

	c.JSON(200, gin.H{
		"message": "password_updated_successfully",
		"user":    id,
	})
}

func (h *Controller) GetUserActivity(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	activities, err := h.service.GetUserActivity(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, activities)
}

func (h *Controller) GetUserPosts(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	posts, err := h.service.GetPostsByUser(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, posts)
}

func (h *Controller) GetUserEvents(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	events, err := h.service.GetEventsByUser(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, events)
}

func (h *Controller) GetUserByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	user, err := h.service.GetUserByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *Controller) FollowUser(c *gin.Context) {
	followerID, _ := c.Get("userID")

	idStr := c.Param("id")
	followingID, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	if err := h.service.FollowUser(followerID.(uint), uint(followingID)); err != nil {
		if err.Error() == "você não pode seguir a si mesmo" {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err.Error() == "você já segue este usuário" {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "usuário seguido com sucesso"})
}

func (h *Controller) UnfollowUser(c *gin.Context) {
	followerID, _ := c.Get("userID")

	idStr := c.Param("id")
	followingID, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	if err := h.service.UnfollowUser(followerID.(uint), uint(followingID)); err != nil {
		if err.Error() == "você não segue este usuário" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

func (h *Controller) IsFollowing(c *gin.Context) {
	followerID, _ := c.Get("userID")

	idStr := c.Param("id")
	followingID, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	following, err := h.service.IsFollowing(followerID.(uint), uint(followingID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"is_following": following})
}

func (h *Controller) GetFollowers(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	users, err := h.service.GetFollowers(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, users)
}

func (h *Controller) GetFollowing(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	users, err := h.service.GetFollowing(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, users)
}
