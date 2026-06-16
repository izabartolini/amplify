package services

import (
	"errors"
	"regexp"
	"strings"
	"unicode"
	"strconv"
	"amplify/server/internal/models"

	"golang.org/x/crypto/bcrypt"
)

var usernameRegex = regexp.MustCompile(`^[a-zA-Z0-9_;.]+$`)

func (s *Service) PostUser(user *models.User) error {
	return s.repository.PostUser(user)
}
func validatePassword(pass string) bool {
	if len(pass) < 8 {
		return false
	}
	var hasUpper, hasLower, hasSpecial bool
	for _, char := range pass {
		switch {
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsLower(char):
			hasLower = true
		case !unicode.IsLetter(char) && !unicode.IsNumber(char):
			hasSpecial = true
		}
	}
	return hasUpper && hasLower && hasSpecial
}
func validateCPF(cpf string) bool {
	re := regexp.MustCompile(`[^0-9]`)
	cleanCPF := re.ReplaceAllString(cpf, "")

	if len(cleanCPF) != 11 {
		return false
	}

	allSame := true
	for i := 1; i < 11; i++ {
		if cleanCPF[i] != cleanCPF[0] {
			allSame = false
			break
		}
	}
	if allSame {
		return false
	}

	sum := 0
	for i := 0; i < 9; i++ {
		num, _ := strconv.Atoi(string(cleanCPF[i]))
		sum += num * (10 - i)
	}
	rest := sum % 11
	d1 := 0
	if rest >= 2 {
		d1 = 11 - rest
	}
	valD1, _ := strconv.Atoi(string(cleanCPF[9]))
	if d1 != valD1 {
		return false
	}

	sum = 0
	for i := 0; i < 10; i++ {
		num, _ := strconv.Atoi(string(cleanCPF[i]))
		sum += num * (11 - i)
	}
	rest = sum % 11
	d2 := 0
	if rest >= 2 {
		d2 = 11 - rest
	}
	valD2, _ := strconv.Atoi(string(cleanCPF[10]))
	if d2 != valD2 {
		return false
	}

	return true
}

type RegisterDTO struct {
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
	Tags           []string `json:"tags"`
}

func (s *Service) RegisterUser(req RegisterDTO) (*models.User, error) {
	req.Email = strings.ToLower(req.Email)

	if !usernameRegex.MatchString(req.Username) {
		return nil, errors.New("Usuário inválido. Utilize apenas letras, números e ( _ ; . )")
	}
	if !validatePassword(req.Password) {
		return nil, errors.New("A senha deve conter 8 caracteres, letras maiúsculas, minúsculas e caractere especial")
	}
	if !validateCPF(req.CPF) {
        return nil, errors.New("CPF inválido")
    }

	if err := s.repository.CheckConflicts(req.Email, req.Username, req.CPF); err != nil {
		return nil, err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("Erro interno ao processar a senha")
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

	if err := s.repository.PostUser(&user); err != nil {
		return nil, errors.New("Erro ao registrar usuário no banco de dados")
	}

	if len(req.Tags) > 0 {
		s.repository.SaveUserTags(user.ID, req.Tags)
	}

	return &user, nil

}

func (s *Service) GetUsers() ([]models.User, error) {
	return s.repository.GetUsers()
}

func (s *Service) GetUsersByName(name string) ([]models.User, error) {
	return s.repository.GetUsersByName(name)
}
