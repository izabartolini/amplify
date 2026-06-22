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

type PostUserDTO struct {
	ID             uint   `json:"id"`
	Name           string `json:"name"`
	Username       string `json:"username"`
	ProfilePicture string `json:"profile_picture"`
	City           string `json:"city"`
	State          string `json:"state"`
}

type PostResponseDTO struct {
	ID        uint             `json:"id"`
	Subtitle  string           `json:"subtitle"`
	CreatedAt string           `json:"created_at"`
	User      PostUserDTO      `json:"user"`
	Medias    []models.Media   `json:"medias"`
	Likes     []models.Like    `json:"likes"`
	Comments  []models.Comment `json:"comments"`
}

func (s *Service) GetFeed() ([]PostResponseDTO, error) {
	posts, err := s.repository.GetFeed()
	if err != nil {
		return nil, err
	}

	var result []PostResponseDTO
	for _, p := range posts {
		result = append(result, PostResponseDTO{
			ID:        p.ID,
			Subtitle:  p.Subtitle,
			CreatedAt: p.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
			User: PostUserDTO{
				ID:             p.User.ID,
				Name:           p.User.Name,
				Username:       p.User.Username,
				ProfilePicture: p.User.ProfilePicture,
				City:           p.User.City,
				State:          p.User.State,
			},
			Medias:   p.Medias,
			Likes:    p.Likes,
			Comments: p.Comments,
		})
	}

	return result, nil
}
