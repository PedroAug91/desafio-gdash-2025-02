# Projeto Fullstack (NestJS + Vite + MongoDB + Python + GoLang)

Este repositório contém uma aplicação completa containerizada utilizando Docker. O backend é construído em **NestJS** (com MongoDB e RabbitMQ) e o frontend em React Router roda sobre **Vite**.

## Pré-requisitos

Para executar este projeto, você precisa apenas de:

* [Docker](https://www.docker.com/get-started)
* [Docker Compose](https://docs.docker.com/compose/install/)
* [Chave de API da OpenAI](https://platform.openai.com/docs/quickstart)

## Como Rodar o Projeto

Siga os passos abaixo para iniciar a aplicação:

### 1. Configuração de Variáveis de Ambiente

Na raiz do projeto, duplique o arquivo de exemplo para criar o seu arquivo de configuração local:

```bash
cp .env.example .env
```

**ATENÇÃO**, você precisa popular a variável `OPENAI_API_KEY` para que os insights de IA funcionem.

### 2. Docker 

Com as variáveis de ambientes populadas no arquivos `.env`, rode o seguinte comando:

```bash
docker compose up --build
```

ou

```bash
docker compose up --build -d
```

## Endpoints API REST

Abaixo estão os endpoints mapeados no sistema:

### Autenticação (/auth)
- POST /auth/signup - Criar nova conta
- POST /auth/signin - Login (Retorna JWT)

### Usuários (/users)
- GET /users - Listar usuários
- POST /users - Criar usuário (Admin)
- GET /users/:id - Detalhes de um usuário
- PATCH /users/:id - Atualizar usuário
- DELETE /users/:id - Remover usuário

### Previsão do Tempo (/weather)
- POST /weather - Criar/Solicitar previsão
- GET /weather/latest - Obter dados mais recentes
- GET /weather/insights/:_id - Obter insights específicos por ID
- GET /weather/exports/:extension - Exportar dados (csv, xlsx, json)

## Usuário padrão

As credenciais do usuário padrão estão no .env:

```bash
API_DEFAULT_USER=superAdmin
API_DEFAULT_EMAIL=superAdmin@email.com
API_DEFAULT_PASSWORD=superSecret
API_DEFAULT_ROLE=ADMIN
```
