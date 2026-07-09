package services

import (
	"amplify/server/internal/models"
	"amplify/server/internal/repositories"
	"crypto/tls"
	"encoding/json"
	"errors"
	"fmt"
	"math/rand"
	"net/smtp"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"
	"unicode"

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

type InstrumentDTO struct {
	Name  string `json:"instrument_name"`
	Level uint8  `json:"instrument_level"`
}
type RegisterDTO struct {
	Name           string          `json:"name" binding:"required"`
	Email          string          `json:"email" binding:"required,email"`
	Username       string          `json:"username" binding:"required"`
	Password       string          `json:"password" binding:"required"`
	CPF            string          `json:"cpf" binding:"required"`
	City           string          `json:"city"`
	State          string          `json:"state"`
	Country        string          `json:"country"`
	Bio            string          `json:"bio"`
	ProfilePicture string          `json:"profile_picture"`
	Tags           []string        `json:"tags"`
	Instruments    []InstrumentDTO `json:"instruments"`
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

	if len(req.Instruments) > 0 {
		repoParams := make([]repositories.InstrumentParams, 0, len(req.Instruments))

		for _, inst := range req.Instruments {
			repoParams = append(repoParams, repositories.InstrumentParams{
				Name:  inst.Name,
				Level: inst.Level,
			})
		}

		if err := s.repository.SaveUserInstruments(user.ID, repoParams); err != nil {
			return nil, errors.New("Usuário criado, mas erro ao salvar os instrumentos")
		}
	}

	s.repository.FindUserWithRelations(user.ID, &user)

	return &user, nil
}

func (s *Service) GetUsers() ([]models.User, error) {
	return s.repository.GetUsers()
}

func (s *Service) GetUsersByName(name string) ([]models.User, error) {
	return s.repository.GetUsersByName(name)
}

type UpdateUserRequest struct {
	Name           string `json:"name"`
	Username       string `json:"username"`
	Bio            string `json:"bio"`
	City           string `json:"city"`
	State          string `json:"state"`
	Country        string `json:"country"`
	TagsRaw        string `form:"tags"`
	InstrumentsRaw string `form:"instruments"`
}
type InstrumentUpdate struct {
	Nome  string `json:"nome"`
	Nivel int    `json:"nivel"`
}
type InstrumentData struct {
	Nome  string `json:"nome"`
	Nivel int    `json:"nivel"`
}

func (s *Service) UpdateUserProfile(userID uint, name string, username string, bio string, city string, cpf string, profilePic string, tagsRaw string, instrumentsRaw string) error {
	updates := map[string]interface{}{
		"name":       name,
		"username":   username,
		"bio":        bio,
		"city":       city,
		"cpf":        cpf,
		"updated_at": time.Now(),
	}

	if profilePic != "" {
		updates["profile_picture"] = profilePic
	}

	err := s.repository.UpdateUserProfileFields(userID, updates)
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
			switch {
			case strings.Contains(err.Error(), "username"):
				return errors.New("Este nome de usuário já está em uso")
			case strings.Contains(err.Error(), "cpf"):
				return errors.New("Este CPF já está cadastrado")
			case strings.Contains(err.Error(), "email"):
				return errors.New("Este e-mail já está cadastrado")
			}
		}
		return errors.New("Erro ao atualizar o perfil")
	}

	if tagsRaw != "" && tagsRaw != "[]" {
		var tags []string
		if err := json.Unmarshal([]byte(tagsRaw), &tags); err == nil {
			if tagErr := s.repository.SaveUserTags(userID, tags); tagErr != nil {
				fmt.Printf("Erro ao salvar tags: %v\n", tagErr)
			}
		}
	}

	if instrumentsRaw != "" && instrumentsRaw != "[]" {
		type InstrumentInput struct {
			Nome  string `json:"nome"`
			Nivel int    `json:"nivel"`
		}
		var inputInstruments []InstrumentInput
		if err := json.Unmarshal([]byte(instrumentsRaw), &inputInstruments); err == nil {

			var params []repositories.InstrumentParams
			for _, inst := range inputInstruments {
				if inst.Nome != "" {
					params = append(params, repositories.InstrumentParams{
						Name:  inst.Nome,
						Level: uint8(inst.Nivel),
					})
				}
			}

			if instErr := s.repository.SaveUserInstruments(userID, params); instErr != nil {
				fmt.Printf("Erro ao salvar instrumentos: %v\n", instErr)
			}
		}
	}

	return nil
}

func (s *Service) DeleteUserAccount(userID uint) error {
	return s.repository.DeleteUser(userID)
}

type UpdateUserPasswordRequest struct {
	Password        string `json:"password"`
	NewPassword     string `json:"newPassword"`
	ConfirmPassword string `json:"confirmPassword"`
}

func (s *Service) UpdateUserPassword(id uint, req UpdateUserPasswordRequest) error {

	user, err := s.repository.GetUserById(id)
	if err != nil {
		return errors.New("user_not_found")
	}

	err = bcrypt.CompareHashAndPassword(
		[]byte(user.Password),
		[]byte(req.Password),
	)

	if err != nil {
		return errors.New("invalid_password")
	}

	if !validatePassword(req.NewPassword) {
		return errors.New("A nova senha deve conter 8 caracteres, letras maiúsculas, minúsculas e caractere especial")
	}

	if req.NewPassword != req.ConfirmPassword {
		return errors.New("passwords_do_not_match")
	}

	hash, err := bcrypt.GenerateFromPassword(
		[]byte(req.NewPassword),
		bcrypt.DefaultCost,
	)

	if err != nil {
		return err
	}

	updates := map[string]interface{}{
		"password": string(hash),
	}

	return s.repository.UpdateUser(id, updates)
}

func (s *Service) SendResetPasswordEmail(to string) error {

	from := os.Getenv("SMTP_EMAIL")
	password := os.Getenv("SMTP_PASSWORD")

	smtpHost := "smtp.gmail.com"
	smtpPort := "465"

	cod := fmt.Sprintf("%06d", rand.Intn(1000000))

	user, err := s.repository.GetUserByEmail(to)
	if err != nil {
		return err
	}

	ResetCodes[to] = ResetCode{
		UserID:    user.ID,
		Code:      cod,
		ExpiresAt: time.Now().Add(10 * time.Minute),
	}

	message := []byte(
		"Subject: Restore password\r\n" +
			"\r\n" +
			"This is the code to change the password:\r\n" +
			cod +
			"\r\n\r\nThis code expires in 10 minutes.",
	)

	tlsConfig := &tls.Config{
		ServerName: smtpHost,
	}

	conn, err := tls.Dial(
		"tcp",
		smtpHost+":"+smtpPort,
		tlsConfig,
	)
	if err != nil {
		return err
	}

	client, err := smtp.NewClient(conn, smtpHost)
	if err != nil {
		return err
	}
	defer client.Quit()

	auth := smtp.PlainAuth(
		"",
		from,
		password,
		smtpHost,
	)
	if err = client.Auth(auth); err != nil {
		return err
	}

	if err = client.Mail(from); err != nil {
		return err
	}

	if err = client.Rcpt(to); err != nil {
		return err
	}

	w, err := client.Data()
	if err != nil {
		return err
	}

	_, err = w.Write(message)
	if err != nil {
		return err
	}

	err = w.Close()
	if err != nil {
		return err
	}

	return nil
}

type UpdateForgotenPasswordRequest struct {
	NewPassword     string `json:"newPassword"`
	ConfirmPassword string `json:"confirmPassword"`
}

func (s *Service) UpdateForgotenPassword(id uint, req UpdateForgotenPasswordRequest) error {

	if !validatePassword(req.NewPassword) {
		return errors.New("password_invalid")
	}

	if req.NewPassword != req.ConfirmPassword {
		return errors.New("passwords_do_not_match")
	}

	hash, err := bcrypt.GenerateFromPassword(
		[]byte(req.NewPassword),
		bcrypt.DefaultCost,
	)

	if err != nil {
		return err
	}

	updates := map[string]interface{}{
		"password": string(hash),
	}

	return s.repository.UpdateUser(id, updates)
}

type ResetCode struct {
	UserID    uint
	Code      string
	ExpiresAt time.Time
}

var ResetCodes = map[string]ResetCode{}

func (s *Service) VerifyResetCode(email string, code string) (uint, error) {
	data, exists := ResetCodes[email]

	if !exists {
		return 0, errors.New("code not found")
	}
	if time.Now().After(data.ExpiresAt) {
		delete(ResetCodes, email)

		return 0, errors.New("code expired")
	}
	if data.Code != code {
		return 0, errors.New("invalid code")
	}

	return data.UserID, nil
}

func (s *Service) GetUserActivity(userID uint) ([]map[string]interface{}, error) {
	return s.repository.GetUserActivity(userID)
}

func (s *Service) GetPostsByUser(userID uint) ([]models.Post, error) {
	return s.repository.GetPostsByUser(userID)
}

func (s *Service) GetEventsByUser(userID uint) ([]models.Event, error) {
	return s.repository.GetEventsByUser(userID)
}

type UserProfileResponse struct {
	ID             uint        `json:"id"`
	Name           string      `json:"name"`
	Username       string      `json:"username"`
	ProfilePicture string      `json:"profile_picture"`
	Bio            string      `json:"bio"`
	City           string      `json:"city"`
	State          string      `json:"state"`
	CPF            string      `json:"cpf"`
	Tags           []string    `json:"tags"`
	Instruments    interface{} `json:"instruments"`
	FollowersCount int         `json:"followers_count"`
	FollowingCount int         `json:"following_count"`
}

func (s *Service) GetUserByID(id uint) (*UserProfileResponse, error) {
	var user models.User
	err := s.repository.FindUserWithRelations(id, &user)
	if err != nil {
		return nil, err
	}

	tagNames := []string{}
	if len(user.Tag) > 0 {
		var tagIDs []uint
		for _, ut := range user.Tag {
			tagIDs = append(tagIDs, ut.TagID)
		}
		tagNames, _ = s.repository.GetTagNamesByIDs(tagIDs)
	}

	type InstrumentFront struct {
		ID    uint   `json:"id"`
		Nome  string `json:"nome"`
		Nivel uint8  `json:"nivel"`
	}

	var instParams []map[string]interface{} = []map[string]interface{}{}
	if len(user.Plays) > 0 {
		var instIDs []uint
		for _, ui := range user.Plays {
			instIDs = append(instIDs, ui.InstrumentID)
		}

		namesMap, err := s.repository.GetInstrumentNamesMap(instIDs)
		if err == nil {
			for i, ui := range user.Plays {
				nomeReal := namesMap[ui.InstrumentID]

				instParams = append(instParams, map[string]interface{}{
					"id":    i + 1,
					"nome":  nomeReal,
					"nivel": ui.Level,
				})
			}
		}
	}

	return &UserProfileResponse{
		ID:             user.ID,
		Name:           user.Name,
		Username:       user.Username,
		ProfilePicture: user.ProfilePicture,
		Bio:            user.Bio,
		City:           user.City,
		State:          user.State,
		CPF:            user.CPF,
		Tags:           tagNames,
		Instruments:    instParams,
		FollowersCount: len(user.Followers),
		FollowingCount: len(user.Following),
	}, nil
}

func (s *Service) FollowUser(followerID uint, followingID uint) error {
	if followerID == followingID {
		return errors.New("você não pode seguir a si mesmo")
	}

	already, err := s.repository.IsFollowing(followerID, followingID)
	if err != nil {
		return err
	}
	if already {
		return errors.New("você já segue este usuário")
	}

	if err := s.repository.FollowUser(followerID, followingID); err != nil {
		return err
	}

	s.CreateNotification(followingID, followerID, "follow", nil)
	return nil
}

func (s *Service) UnfollowUser(followerID uint, followingID uint) error {
	following, err := s.repository.IsFollowing(followerID, followingID)
	if err != nil {
		return err
	}
	if !following {
		return errors.New("você não segue este usuário")
	}

	return s.repository.UnfollowUser(followerID, followingID)
}

func (s *Service) IsFollowing(followerID uint, followingID uint) (bool, error) {
	return s.repository.IsFollowing(followerID, followingID)
}

func (s *Service) GetFollowers(userID uint) ([]models.User, error) {
	return s.repository.GetFollowers(userID)
}

func (s *Service) GetFollowing(userID uint) ([]models.User, error) {
	return s.repository.GetFollowing(userID)
}
