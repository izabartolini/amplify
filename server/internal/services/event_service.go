package services

import (
    "time"
    "amplify/server/internal/models"
    "amplify/server/internal/repositories"
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