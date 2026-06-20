package services

import (
    "time"
    "amplify/server/internal/models"
    "amplify/server/internal/repositories"
    "errors"
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
func (s *Service) GetEvent(eventID uint) (*models.Event, error){
    return s.repository.GetEventByID(eventID)
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