package repositories

import (
	"amplify/server/internal/models"
	"errors"
	"fmt"
	"regexp"
	"strings"

	"gorm.io/gorm"
)

type InstrumentRepository struct {
	db *gorm.DB
}

func NewInstrumentRepository(db *gorm.DB) *InstrumentRepository {
	return &InstrumentRepository{db: db}
}

func (r *InstrumentRepository) GetAllInstruments(searchQuery string) ([]models.Instrument, error) {
	var instruments []models.Instrument
	
	query := r.db.Order("name asc")

	if searchQuery != "" {
		cleanSearch := strings.ToUpper(strings.TrimSpace(searchQuery))
		query = query.Where("name LIKE ?", fmt.Sprintf("%%%s%%", cleanSearch))
	}
	
	err := query.Find(&instruments).Error
	if err != nil {
		return nil, err
	}
	
	return instruments, nil
}

type InstrumentParams struct{
	Name string
	Level uint8
}

func (r *Repository) SaveUserInstruments(userId uint, instrument []InstrumentParams) error {
	var instrumentValidationRegex = regexp.MustCompile(`^[A-Z0-9À-Ú\s-]+$`)
	for _, inst := range instrument {
		cleanName := strings.ToUpper(strings.TrimSpace(inst.Name))

		if cleanName == "" {
			continue
		}
		if !instrumentValidationRegex.MatchString(cleanName) {
			continue
		}

		if inst.Level > 5 {
			return errors.New("Nível inválido: deve ser entre 0 e 5")
		}

		var newInstrument models.Instrument
		if err := r.db.FirstOrCreate(&newInstrument, models.Instrument{Name: cleanName}).Error; err != nil {
			continue
		}

		var userInstrument models.UserInstrument
		if err := r.db.FirstOrCreate(&userInstrument, models.UserInstrument{
			UserID:       uint(userId),
			InstrumentID: newInstrument.ID,
			Level:        inst.Level,
		}).Error; err != nil {
			continue
		}

	}

	return nil
}