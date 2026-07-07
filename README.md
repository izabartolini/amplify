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

## Padrão de Projeto

O projeto utiliza o **Repository Pattern** para separar a lógica de acesso ao banco de dados da lógica de negócio.

A arquitetura segue o fluxo:
Routes → Controllers → Services → Repositories → Banco de dados

**Responsabilidades de cada camada:**

- **Routes** — define os endpoints e middlewares (autenticação JWT)
- **Controllers** — recebe as requisições HTTP, valida o payload e chama o service
- **Services** — contém a lógica de negócio, validações e regras do domínio
- **Repositories** — responsável exclusivamente pelo acesso ao banco de dados via GORM

**Benefícios aplicados no projeto:**
- Facilidade para trocar o banco de dados sem alterar a lógica de negócio
- Código organizado e de fácil manutenção
- Separação clara de responsabilidades entre as camadas

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

Os testes de unidade cobrem as duas operações principais do sistema:

1. **Curtir post** — valida o fluxo de like/unlike
2. **Seguir usuário** — valida o fluxo de follow/unfollow

Para rodar os testes:
```bash
cd amplify/server
go test ./...
```