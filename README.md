# Amplify

**Amplify** é uma plataforma social voltada para músicos amadores que desejam se conectar, compartilhar sua produção musical e descobrir eventos na sua região.

A plataforma permite que músicos criem perfis personalizados com seus instrumentos, nível de experiência e interesses musicais. Através do feed, os usuários podem publicar posts com texto e mídia, curtir e comentar nas publicações de outros músicos. Na seção de eventos, é possível criar, descobrir e participar de eventos musicais públicos ou privados. O sistema também conta com busca por músicos e filtros por região para facilitar a descoberta de pessoas com interesses semelhantes.

---

## Equipe

| Nome | GitHub |
|---|---|
| Eduardo da Silva | [@EDUARDOdaSILVAA](https://github.com/EDUARDOdaSILVAA) |
| Izabelly Bartolini | [@izabartolini](https://github.com/izabartolini) |
| José Vinícius Grecco | [@JoseVinicius05](https://github.com/JoseVinicius05) |
| Juliana Carvalho | [@julicarvalhos](https://github.com/julicarvalhos) |

---

## Stack

**Backend:**
- Go 1.26
- Gin (framework HTTP)
- GORM (ORM)
- PostgreSQL
- JWT para autenticação
- Cloudinary para upload de mídia
- godotenv para variáveis de ambiente
- CORS via gin-contrib/cors

**Frontend:**
- React 19 com Vite
- React Router DOM
- Mantine UI
- Tabler Icons
- Day.js
- Yarn

---

## Padrões de Projeto & Arquitetura

### Padrão Observer (Sistema de Notificações Baseado em Eventos)

A plataforma utiliza o padrão comportamental **Observer** para gerenciar interações e alertas automáticos gerados entre os músicos da comunidade (como curtidas, novos comentários ou novos seguidores) sem poluir ou acoplar as regras centrais de negócio do sistema.

#### Funcionamento e Fluxo do Ecossistema:
Quando um usuário realiza uma ação com sucesso no sistema, o serviço encarregado atua como o emissor do evento. Ele processa a sua persistência de dados principal e, logo em seguida, invoca o método de notificações para alertar o perfil afetado.

#### Exemplo de Implementação no Código:
O método `LikePost` valida e computa o vínculo da curtida no banco de dados e, imediatamente antes de retornar o sucesso ao cliente, delega a criação do alerta ao observador correspondente via `CreateNotification`:

```go
func (s *Service) LikePost(userID uint, postID uint) error {
    post, err := s.repository.GetPostByID(postID)
    if err != nil {
        return errors.New("post não encontrado")
    }
    
    // 1. Altera o estado do banco (Registra a curtida)
    if err := s.repository.LikePost(userID, postID); err != nil {
        return err
    }
    
    // 2. Notifica o observador (Dono do Post) sobre o evento ocorrido
    s.CreateNotification(post.UserID, userID, "like", &postID)
    return nil
}
```
---

## Funcionalidades

- Cadastro e autenticação de usuários com JWT
- Recuperação de senha via e-mail
- Perfil personalizado com instrumentos, nível, tags de interesse e localização
- Feed de posts com curtidas, comentários e filtro por região
- Criação, edição e exclusão de posts com upload de mídia (Cloudinary)
- Criação e participação em eventos públicos e privados
- Sistema de seguidores e seguindo com listagem de cada um
- Busca de músicos por nome
- Aba de atividade no perfil (curtidas, comentários e follows)

---

## Operações Principais

O sistema possui as seguintes operações testáveis:

1. **Curtir post** — usuário autenticado curte ou descurte um post (`POST /api/posts/:id/like` e `DELETE /api/posts/:id/like`)
2. **Seguir usuário** — usuário autenticado segue ou deixa de seguir outro músico (`POST /api/users/:id/follow` e `DELETE /api/users/:id/follow`)

---

## Variáveis de Ambiente

Crie um arquivo `.env` dentro da pasta `server/` baseado no arquivo `.env.example`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=amplify
JWT_SECRET=sua_chave_secreta
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
SMTP_EMAIL=seu_email@gmail.com
SMTP_PASSWORD=sua_senha_de_app
```

---

## Como subir o backend

### Pré-requisitos

- Go 1.26+
- PostgreSQL instalado e rodando
- Conta no Cloudinary (para upload de mídia)
- Conta de e-mail com SMTP habilitado (para recuperação de senha)

### Configuração

1. Clone o repositório:
```bash
git clone https://github.com/izabartolini/amplify.git
cd amplify/server
```

2. Crie o banco de dados PostgreSQL:
```sql
CREATE DATABASE amplify;
```

3. Crie o arquivo `.env` dentro da pasta `server/` conforme a seção acima.

4. Instale as dependências e suba o servidor:
```bash
go mod tidy
go run cmd/api/main.go
```

O servidor estará disponível em `http://localhost:8080`.

> As tabelas são criadas automaticamente pelo GORM na primeira execução — não é necessário rodar migrations manualmente.

---

## Como subir o frontend

### Pré-requisitos

- Node.js 18+
- Yarn

### Configuração

1. Entre na pasta do frontend:
```bash
cd amplify/client
```

2. Instale as dependências:
```bash
yarn install
```

3. Suba o servidor de desenvolvimento:
```bash
yarn dev
```

O frontend estará disponível em `http://localhost:5173`.

> **Atenção:** O backend deve estar rodando antes de iniciar o frontend.

---

## Testes

O projeto possui testes de unidade cobrindo as principais validações de negócio.

Para rodar os testes:

```bash
cd amplify/server
go test -v ./internal/services
```

### O que é testado

- **Validação de senha** — verifica se a senha atende aos requisitos de segurança (letras maiúsculas, minúsculas e caractere especial)
- **Validação de CPF** — verifica se o CPF informado é válido
```