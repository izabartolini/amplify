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
	ID        uint                 `json:"id"`
	Subtitle  string               `json:"subtitle"`
	CreatedAt string               `json:"created_at"`
	User      PostUserDTO          `json:"user"`
	Medias    []models.Media       `json:"medias"`
	Likes     []models.Like        `json:"likes"`
	Comments  []CommentResponseDTO `json:"comments"`
}

func (s *Service) GetFeed() ([]PostResponseDTO, error) {
	posts, err := s.repository.GetFeed()
	if err != nil {
		return nil, err
	}

	var result []PostResponseDTO
	for _, p := range posts {
		comments := []CommentResponseDTO{}
		for _, c := range p.Comments {
			comments = append(comments, CommentResponseDTO{
				ID:        c.ID,
				Text:      c.Text,
				CreatedAt: c.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
				User: CommentUserDTO{
					ID:             c.User.ID,
					Name:           c.User.Name,
					Username:       c.User.Username,
					ProfilePicture: c.User.ProfilePicture,
				},
			})
		}

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
			Comments: comments,
		})
	}

	return result, nil
}

type CommentUserDTO struct {
	ID             uint   `json:"id"`
	Name           string `json:"name"`
	Username       string `json:"username"`
	ProfilePicture string `json:"profile_picture"`
}

type CommentResponseDTO struct {
	ID        uint           `json:"id"`
	Text      string         `json:"text"`
	CreatedAt string         `json:"created_at"`
	User      CommentUserDTO `json:"user"`
}

type PostDetailDTO struct {
	ID        uint                 `json:"id"`
	Subtitle  string               `json:"subtitle"`
	CreatedAt string               `json:"created_at"`
	User      PostUserDTO          `json:"user"`
	Medias    []models.Media       `json:"medias"`
	LikeCount int                  `json:"like_count"`
	Comments  []CommentResponseDTO `json:"comments"`
}

func (s *Service) GetPostByID(id uint) (*PostDetailDTO, error) {
	post, err := s.repository.GetPostByID(id)
	if err != nil {
		return nil, errors.New("post não encontrado")
	}

	comments := []CommentResponseDTO{}
	for _, c := range post.Comments {
		comments = append(comments, CommentResponseDTO{
			ID:        c.ID,
			Text:      c.Text,
			CreatedAt: c.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
			User: CommentUserDTO{
				ID:             c.User.ID,
				Name:           c.User.Name,
				Username:       c.User.Username,
				ProfilePicture: c.User.ProfilePicture,
			},
		})
	}

	return &PostDetailDTO{
		ID:        post.ID,
		Subtitle:  post.Subtitle,
		CreatedAt: post.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		User: PostUserDTO{
			ID:             post.User.ID,
			Name:           post.User.Name,
			Username:       post.User.Username,
			ProfilePicture: post.User.ProfilePicture,
			City:           post.User.City,
			State:          post.User.State,
		},
		Medias:    post.Medias,
		LikeCount: len(post.Likes),
		Comments:  comments,
	}, nil
}

func (s *Service) LikePost(userID uint, postID uint) error {
	_, err := s.repository.GetPostByID(postID)
	if err != nil {
		return errors.New("post não encontrado")
	}
	return s.repository.LikePost(userID, postID)
}

func (s *Service) UnlikePost(userID uint, postID uint) error {
	_, err := s.repository.GetPostByID(postID)
	if err != nil {
		return errors.New("post não encontrado")
	}
	return s.repository.UnlikePost(userID, postID)
}

type CreateCommentDTO struct {
	Text string `json:"text"`
}

func (s *Service) CreateComment(userID uint, postID uint, req CreateCommentDTO) (*models.Comment, error) {
	if req.Text == "" {
		return nil, errors.New("comentário não pode ser vazio")
	}
	if len(req.Text) > 200 {
		return nil, errors.New("comentário não pode ter mais de 200 caracteres")
	}

	_, err := s.repository.GetPostByID(postID)
	if err != nil {
		return nil, errors.New("post não encontrado")
	}

	comment := &models.Comment{
		UserID: userID,
		PostID: postID,
		Text:   req.Text,
	}

	if err := s.repository.CreateComment(comment); err != nil {
		return nil, errors.New("erro ao criar comentário")
	}

	return comment, nil
}

func (s *Service) DeleteComment(commentID uint, userID uint, postID uint) error {
	return s.repository.DeleteComment(commentID, userID, postID)
}

func (s *Service) UpdatePost(postID uint, userID uint, subtitle string) error {
	post, err := s.repository.GetPostByID(postID)
	if err != nil {
		return errors.New("post não encontrado")
	}
	if post.UserID != userID {
		return errors.New("sem permissão para editar este post")
	}
	return s.repository.UpdatePost(postID, subtitle)
}

func (s *Service) DeletePost(postID uint, userID uint) error {
	post, err := s.repository.GetPostByID(postID)
	if err != nil {
		return errors.New("post não encontrado")
	}
	if post.UserID != userID {
		return errors.New("sem permissão para deletar este post")
	}
	return s.repository.DeletePost(postID)
}
