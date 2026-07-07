package services

import (
	"testing"
)

func TestValidatePassword(t *testing.T) {
	tests := []struct {
		name     string
		password string
		want     bool
	}{
		{
			name:     "Senha Válida",
			password: "SenhaEspecial#2026",
			want:     true,
		},
		{
			name:     "Erro: Menos de 8 caracteres",
			password: "A1b2#",
			want:     false,
		},
		{
			name:     "Erro: Sem letra maiúscula",
			password: "senhaespecial#2026",
			want:     false,
		},
		{
			name:     "Erro: Sem letra minúscula",
			password: "SENHAESPECIAL#2026",
			want:     false,
		},
		{
			name:     "Erro: Sem caractere especial",
			password: "SenhaNormal2026",
			want:     false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := validatePassword(tt.password)
			if got != tt.want {
				t.Errorf("validatePassword(%q) = %v; mas queríamos %v", tt.password, got, tt.want)
			}
		})
	}
}

func TestValidateCPF(t *testing.T) {
	tests := []struct {
		name string
		cpf  string
		want bool
	}{
		{
			name: "CPF Válido com pontuação",
			cpf:  "111.444.777-35",
			want: true,
		},
		{
			name: "CPF Válido apenas números",
			cpf:  "11144477735",
			want: true,
		},
		{
			name: "Erro: Quantidade inválida de dígitos",
			cpf:  "123.456.789-0",
			want: false,
		},
		{
			name: "Erro: Todos os dígitos iguais (falso positivo comum)",
			cpf:  "111.111.111-11",
			want: false,
		},
		{
			name: "Erro: Primeiro dígito verificador inválido",
			cpf:  "111.444.777-05",
			want: false,
		},
		{
			name: "Erro: Segundo dígito verificador inválido",
			cpf:  "111.444.777-30",
			want: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := validateCPF(tt.cpf)
			if got != tt.want {
				t.Errorf("validateCPF(%q) = %v; mas queríamos %v", tt.cpf, got, tt.want)
			}
		})
	}
}