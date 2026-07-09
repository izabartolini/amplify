# Amplify

[🇧🇷 Português](#português) | [🇺🇸 English](#english)

---

## Português

**Amplify** é uma plataforma social voltada para músicos amadores que desejam se conectar, compartilhar sua produção musical e descobrir eventos na sua região.

A plataforma permite que músicos criem perfis personalizados com seus instrumentos, nível de experiência e interesses musicais. Através do feed, os usuários podem publicar posts com texto e mídia, curtir e comentar nas publicações de outros músicos. Na seção de eventos, é possível criar, descobrir e participar de eventos musicais públicos ou privados. O sistema também conta com busca e descoberta de músicos, filtros por região e um sistema de notificações para manter os usuários informados sobre interações no seu perfil.

---

### Equipe

| Nome | GitHub |
|---|---|
| Eduardo da Silva | [@EDUARDOdaSILVAA](https://github.com/EDUARDOdaSILVAA) |
| Izabelly Bartolini | [@izabartolini](https://github.com/izabartolini) |
| José Vinícius Grecco | [@JoseVinicius05](https://github.com/JoseVinicius05) |
| Juliana Carvalho | [@julicarvalhos](https://github.com/julicarvalhos) |

---

### Stack

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
- Mantine UI (core, notifications, dates)
- Tabler Icons e Phosphor Icons
- Day.js
- Yarn

---

### Padrões de Projeto & Arquitetura

#### Padrão Observer (Sistema de Notificações Baseado em Eventos)

A plataforma utiliza o padrão comportamental **Observer** para gerenciar interações e alertas automáticos gerados entre os músicos da comunidade (como curtidas, novos comentários ou novos seguidores) sem poluir ou acoplar as regras centrais de negócio do sistema.

##### Funcionamento e Fluxo do Ecossistema:
Quando um usuário realiza uma ação com sucesso no sistema, o serviço encarregado atua como o emissor do evento. Ele processa a sua persistência de dados principal e, logo em seguida, invoca o método de notificações para alertar o perfil afetado.

##### Exemplo de Implementação no Código:
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

### Funcionalidades

- Cadastro e autenticação de usuários com JWT
- Recuperação de senha via e-mail
- Perfil personalizado com instrumentos, nível, tags de interesse e localização
- Feed de posts com curtidas, comentários e filtro por região
- Criação, edição e exclusão de posts com upload de mídia (Cloudinary)
- Criação e participação em eventos públicos e privados
- Calendário de eventos no perfil, com distinção visual entre eventos organizados e eventos em que o usuário participa
- Sistema de seguidores e seguindo com listagem de cada um
- Página de descoberta ("Amplifique") e busca de músicos por nome
- Sistema de notificações em tempo real para curtidas, comentários e novos seguidores
- Aba de atividade no perfil (curtidas, comentários e follows)

---

### Variáveis de Ambiente

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
CLOUDINARY_URL=cloudinary://sua_api_key:sua_api_secret@seu_cloud_name
SMTP_EMAIL=seu_email@gmail.com
SMTP_PASSWORD=sua_senha_de_app
```

> `CLOUDINARY_URL` é usada especificamente no upload de foto de perfil — sem ela, essa funcionalidade não funciona mesmo com as outras variáveis do Cloudinary configuradas.

---

### Como subir o backend

#### Pré-requisitos

- Go 1.26+
- PostgreSQL instalado e rodando
- Conta no Cloudinary (para upload de mídia)
- Conta de e-mail com SMTP habilitado (para recuperação de senha)

#### Configuração

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

### Como subir o frontend

#### Pré-requisitos

- Node.js 18+
- Yarn

#### Configuração

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

### Testes

O projeto possui testes de unidade cobrindo as principais validações de negócio.

Para rodar os testes:

```bash
cd amplify/server
go test -v ./internal/services
```

#### O que é testado

- **Validação de senha** — verifica se a senha atende aos requisitos de segurança (letras maiúsculas, minúsculas e caractere especial)
- **Validação de CPF** — verifica se o CPF informado é válido

---

## English

**Amplify** is a social platform for amateur musicians who want to connect, share their music, and discover events in their region.

The platform lets musicians create personalized profiles with their instruments, experience level, and musical interests. Through the feed, users can publish posts with text and media, like, and comment on other musicians' posts. In the events section, users can create, discover, and join public or private music events. The system also includes musician search and discovery, region filters, and a notification system to keep users informed about interactions on their profile.

---

### Team

| Name | GitHub |
|---|---|
| Eduardo da Silva | [@EDUARDOdaSILVAA](https://github.com/EDUARDOdaSILVAA) |
| Izabelly Bartolini | [@izabartolini](https://github.com/izabartolini) |
| José Vinícius Grecco | [@JoseVinicius05](https://github.com/JoseVinicius05) |
| Juliana Carvalho | [@julicarvalhos](https://github.com/julicarvalhos) |

---

### Stack

**Backend:**
- Go 1.26
- Gin (HTTP framework)
- GORM (ORM)
- PostgreSQL
- JWT for authentication
- Cloudinary for media upload
- godotenv for environment variables
- CORS via gin-contrib/cors

**Frontend:**
- React 19 with Vite
- React Router DOM
- Mantine UI (core, notifications, dates)
- Tabler Icons and Phosphor Icons
- Day.js
- Yarn

---

### Design Patterns & Architecture

#### Observer Pattern (Event-Based Notification System)

The platform uses the **Observer** behavioral pattern to manage automatic interactions and alerts generated between musicians in the community (such as likes, new comments, or new followers) without polluting or coupling the system's core business rules.

##### How the Ecosystem Works:
When a user successfully performs an action in the system, the responsible service acts as the event emitter. It handles its primary data persistence and, right after, invokes the notification method to alert the affected profile.

##### Code Implementation Example:
The `LikePost` method validates and persists the like in the database and, right before returning success to the client, delegates the alert creation to the corresponding observer via `CreateNotification`:

```go
func (s *Service) LikePost(userID uint, postID uint) error {
    post, err := s.repository.GetPostByID(postID)
    if err != nil {
        return errors.New("post não encontrado")
    }
    
    // 1. Updates database state (registers the like)
    if err := s.repository.LikePost(userID, postID); err != nil {
        return err
    }
    
    // 2. Notifies the observer (post owner) about the event
    s.CreateNotification(post.UserID, userID, "like", &postID)
    return nil
}
```

---

### Features

- User registration and authentication with JWT
- Password recovery via email
- Personalized profile with instruments, skill level, interest tags, and location
- Post feed with likes, comments, and region filtering
- Post creation, editing, and deletion with media upload (Cloudinary)
- Creation of and participation in public and private events
- Profile events calendar, visually distinguishing organized events from events the user is participating in
- Followers/following system with a list for each
- Musician discovery page ("Amplifique") and search by name
- Real-time notification system for likes, comments, and new followers
- Activity tab on the profile (likes, comments, and follows)

---

### Environment Variables

Create a `.env` file inside the `server/` folder based on the `.env.example` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=amplify
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

> `CLOUDINARY_URL` is specifically used for profile picture uploads — without it, that feature won't work even with the other Cloudinary variables set.

---

### Running the Backend

#### Prerequisites

- Go 1.26+
- PostgreSQL installed and running
- Cloudinary account (for media upload)
- Email account with SMTP enabled (for password recovery)

#### Setup

1. Clone the repository:
```bash
git clone https://github.com/izabartolini/amplify.git
cd amplify/server
```

2. Create the PostgreSQL database:
```sql
CREATE DATABASE amplify;
```

3. Create the `.env` file inside the `server/` folder as described above.

4. Install dependencies and start the server:
```bash
go mod tidy
go run cmd/api/main.go
```

The server will be available at `http://localhost:8080`.

> Tables are automatically created by GORM on first run — there's no need to run migrations manually.

---

### Running the Frontend

#### Prerequisites

- Node.js 18+
- Yarn

#### Setup

1. Go to the frontend folder:
```bash
cd amplify/client
```

2. Install dependencies:
```bash
yarn install
```

3. Start the development server:
```bash
yarn dev
```

The frontend will be available at `http://localhost:5173`.

> **Note:** The backend must be running before starting the frontend.

---

### Tests

The project has unit tests covering the main business validations.

To run the tests:

```bash
cd amplify/server
go test -v ./internal/services
```

#### What is tested

- **Password validation** — checks whether the password meets security requirements (uppercase, lowercase, and a special character)
- **CPF validation** — checks whether the provided CPF is valid
