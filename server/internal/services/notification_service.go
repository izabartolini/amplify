package services

import (
	"amplify/server/internal/models"
	"errors"
)

type NotificationActorDTO struct {
	ID             uint   `json:"id"`
	Name           string `json:"name"`
	Username       string `json:"username"`
	ProfilePicture string `json:"profile_picture"`
}

type NotificationResponseDTO struct {
	ID        uint                 `json:"id"`
	Type      string               `json:"type"`
	Read      bool                 `json:"read"`
	CreatedAt string               `json:"created_at"`
	Actor     NotificationActorDTO `json:"actor"`
	PostID    *uint                `json:"post_id"`
}

// CreateNotification is an internal helper, called by other services (like, comment, follow).
func (s *Service) CreateNotification(recipientID uint, actorID uint, notifType string, postID *uint) error {
	// Don't notify users about their own actions
	if recipientID == actorID {
		return nil
	}

	notification := &models.Notification{
		RecipientID: recipientID,
		ActorID:     actorID,
		Type:        notifType,
		PostID:      postID,
	}

	return s.repository.CreateNotification(notification)
}

func (s *Service) GetNotifications(recipientID uint) ([]NotificationResponseDTO, error) {
	notifications, err := s.repository.GetNotificationsByRecipient(recipientID)
	if err != nil {
		return nil, err
	}

	result := []NotificationResponseDTO{}
	for _, n := range notifications {
		var postID *uint
		if n.Post != nil {
			postID = &n.Post.ID
		}

		result = append(result, NotificationResponseDTO{
			ID:        n.ID,
			Type:      n.Type,
			Read:      n.Read,
			CreatedAt: n.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
			Actor: NotificationActorDTO{
				ID:             n.Actor.ID,
				Name:           n.Actor.Name,
				Username:       n.Actor.Username,
				ProfilePicture: n.Actor.ProfilePicture,
			},
			PostID: postID,
		})
	}

	return result, nil
}

func (s *Service) MarkNotificationAsRead(notificationID uint, recipientID uint) error {
	if err := s.repository.MarkNotificationAsRead(notificationID, recipientID); err != nil {
		return errors.New("notificação não encontrada")
	}
	return nil
}
