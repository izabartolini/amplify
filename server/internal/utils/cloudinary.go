package utils

import (
	"context"
	"fmt"
	"mime/multipart"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type CloudinaryService struct {
	cld *cloudinary.Cloudinary
}

func NewCloudinaryService() (*CloudinaryService, error) {
	cld, err := cloudinary.NewFromParams(
		os.Getenv("CLOUDINARY_CLOUD_NAME"),
		os.Getenv("CLOUDINARY_API_KEY"),
		os.Getenv("CLOUDINARY_API_SECRET"),
	)


	if err != nil {
		return nil, err
	}

	return &CloudinaryService{
		cld: cld,
	}, nil
}

func (s *CloudinaryService) Upload(file multipart.File, userID uint) (string, string, error) {

	fmt.Println("Iniciando upload para Cloudinary...")

	result, err := s.cld.Upload.Upload(
		context.Background(),
		file,
		uploader.UploadParams{
			Folder:       fmt.Sprintf("amplify/users/%d/posts", userID),
			ResourceType: "auto",
		},
	)

	if err != nil {
		fmt.Println("Erro Cloudinary:", err)
		return "", "", err
	}

	mediaType := "photo"

	if result.ResourceType == "video" {
		mediaType = "video"
	}

	return result.SecureURL, mediaType, nil
}
