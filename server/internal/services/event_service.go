package services

import (
	"amplify/server/internal/models"
	"amplify/server/internal/repositories"
	"errors"
	"time"
)

type CreateEventRequest struct {
	Name        string    `json:"name" binding:"required"`
	Description string    `json:"description"`
	Date        time.Time `json:"date" binding:"required"`
	IsPrivate   bool      `json:"is_private"`
	Place       string    `json:"place"`
	City        string    `json:"city"`
	State       string    `json:"state"`
	Country     string    `json:"country"`
}

type EventService struct {
	Repo *repositories.Repository
}

func (s *Service) CreateEvent(req CreateEventRequest, authenticatedUserID uint) (*models.Event, error) {
	event := &models.Event{
		UserID:      authenticatedUserID,
		Name:        req.Name,
		Description: req.Description,
		Date:        req.Date,
		IsPrivate:   req.IsPrivate,
		Place:       req.Place,
		City:        req.City,
		State:       req.State,
		Country:     req.Country,
	}

	err := s.repository.CreateEvent(event)
	return event, err
}

func (s *Service) RequestParticipation(eventID uint, requesterUserID uint) error {
	participation := &models.Participate{
		EventID: eventID,
		UserID:  requesterUserID,
		Status:  "pending",
	}
	return s.repository.CreateParticipation(participation)
}

func (s *Service) InviteUser(eventID uint, invitedUserID uint) error {
	participation := &models.Participate{
		EventID: eventID,
		UserID:  invitedUserID,
		Status:  "invited",
	}
	return s.repository.CreateParticipation(participation)
}
func (s *Service) GetEvent(eventID uint, requesterUserID uint) (*models.Event, error) {
	event, err := s.repository.GetEventByID(eventID)
	if err != nil {
		return nil, err
	}
	if !event.IsPrivate {
		return event, nil
	}
	if event.UserID == requesterUserID {
		return event, nil
	}
	temPermissao := false
	for _, participante := range event.Participants {
		if participante.UserID == requesterUserID && (participante.Status == "accepted" || participante.Status == "invited") {
			temPermissao = true
			break
		}
	}

	if !temPermissao {
		return nil, errors.New("este evento é privado e você não tem permissão para visualizá-lo")
	}

	return event, nil
}
func (s *Service) GetEventRequests(eventID uint, requesterUserID uint) ([]models.Participate, error) {
	event, err := s.repository.GetEventByID(eventID)
	if err != nil {
		return nil, err
	}
	if event.UserID != requesterUserID {
		return nil, errors.New("acesso negado: apenas o dono do evento pode ver as solicitações")
	}
	participations, err := s.repository.GetPendingRequests(eventID)

	return participations, err
}

type UpdateEventRequest struct {
	Name        string     `json:"name"`
	Description string     `json:"description"`
	Date        *time.Time `json:"date"`
	IsPrivate   *bool      `json:"is_private"`
	Place       string     `json:"place"`
	City        string     `json:"city"`
	State       string     `json:"state"`
	Country     string     `json:"country"`
}

func (s *Service) UpdateEvent(eventID uint, ownerID uint, req UpdateEventRequest) (*models.Event, error) {
	event, err := s.repository.GetEventByID(eventID)
	if err != nil {
		return nil, err
	}
	if event.UserID != ownerID {
		return nil, errors.New("Acesso negado")
	}
	if req.Name != "" {
		event.Name = req.Name
	}
	if req.IsPrivate != nil {
		event.IsPrivate = *req.IsPrivate
	}
	if req.Description != "" {
		event.Description = req.Description
	}
	if req.Date != nil {
		event.Date = *req.Date
	}
	if req.Place != "" {
		event.Place = req.Place
	}
	if req.City != "" {
		event.City = req.City
	}
	if req.State != "" {
		event.State = req.State
	}
	if req.Country != "" {
		event.Country = req.Country
	}
	err = s.repository.UpdateEvent(event)
	if err != nil {
		return nil, err
	}
	return event, nil
}
func (s *Service) DeleteEvent(eventID uint, ownerID uint) error {
	event, err := s.repository.GetEventByID(eventID)
	if err != nil {
		return err
	}
	if event.UserID != ownerID {
		return errors.New("Acesso negado")
	}
	err = s.repository.DeleteEvent(event)
	if err != nil {
		return err
	}
	return nil
}
func (s *Service) GetAllEvents() ([]models.Event, error) {
	return s.repository.GetAllEvents()
}
