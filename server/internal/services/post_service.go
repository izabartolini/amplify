package services

import (
	"amplify/server/internal/models"
	"errors"
)

type CreatePostDTO struct {
	Subtitle string     `json:"subtitle"`
	Medias   []MediaDTO `json:"medias"`
	Tags     []string   `json:"tags"`
}

type MediaDTO struct {
	URL   string `json:"url"`
	Type  string `json:"type"`
	Order int    `json:"order"`
}

func (s *Service) CreatePost(userID uint, req CreatePostDTO) (*models.Post, error) {
	if len(req.Medias) > 5 {
		return nil, errors.New("máximo de 5 mídias por post")
	}

	for _, m := range req.Medias {
		if m.Type != "photo" && m.Type != "video" {
			return nil, errors.New("tipo de mídia inválido, use 'photo' ou 'video'")
		}
	}

	var medias []models.Media
	for _, m := range req.Medias {
		medias = append(medias, models.Media{
			Url:   m.URL,
			Type:  m.Type,
			Order: m.Order,
		})
	}

	post := &models.Post{
		UserID:   userID,
		Subtitle: req.Subtitle,
		Medias:   medias,
	}

	if err := s.repository.CreatePost(post); err != nil {
		return nil, errors.New("erro ao criar post")
	}

	return post, nil
}
