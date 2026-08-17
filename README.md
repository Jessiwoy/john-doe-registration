# John Doe Registration

Aplicação full stack para cadastro único de clientes, construída com React, TypeScript, NestJS, Prisma e PostgreSQL.

O projeto atende ao desafio “John Doe e seu form de cadastro”: uma tela de cadastro coleta nome completo, CPF, e-mail, cor preferida e observações, persiste os dados em PostgreSQL e informa ao usuário se o cadastro foi realizado com sucesso.

## Stack

- Frontend: React, TypeScript, Vite, TailwindCSS, React Hook Form, Zod, Axios, Vitest e Testing Library.
- Backend: Node.js, TypeScript, NestJS, Prisma ORM, Zod e Jest.
- Banco: PostgreSQL.
- Infra local: Docker Compose.

## Estrutura

```text
john-doe-registration/
├── backend/
│   ├── prisma/
│   └── src/
├── frontend/
│   └── src/
├── docker-compose.yml
├── .env.example
└── README.md
```

## Arquitetura

```text
React + TypeScript
        ↓ REST
NestJS + TypeScript
        ↓ Prisma
    PostgreSQL
```

O frontend é responsável pela interface do formulário e pela validação inicial para melhorar a experiência do usuário. O backend concentra as regras de negócio e a validação definitiva dos dados recebidos. O Prisma faz o acesso ao PostgreSQL e mantém o relacionamento entre clientes e cores.

## Execução Com Docker

Pré-requisitos:

- Docker
- Docker Compose

Execute na raiz do projeto:

```bash
docker compose up --build
```

Serviços:

```text
frontend: http://localhost:5173
backend:  http://localhost:3000
postgres: localhost:5432
```

O backend aplica migrations, gera o Prisma Client e executa o seed das cores ao subir. O avaliador não precisa criar tabelas ou inserir cores manualmente.

## Variáveis De Ambiente

Use `.env.example` como referência:

```env
POSTGRES_USER=john_doe
POSTGRES_PASSWORD=john_doe_password
POSTGRES_DB=john_doe_registration
POSTGRES_PORT=5432
DATABASE_URL=postgresql://john_doe:john_doe_password@postgres:5432/john_doe_registration?schema=public
BACKEND_PORT=3000
FRONTEND_PORT=5173
FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:3000
```

Não versionar `.env` real.

## Execução Local

Suba o PostgreSQL:

```bash
docker compose up -d postgres
```

Quando toda a aplicação roda pelo Docker Compose, o backend acessa o banco pelo hostname interno `postgres`:

```env
DATABASE_URL=postgresql://john_doe:john_doe_password@postgres:5432/john_doe_registration?schema=public
```

Quando o backend roda diretamente na máquina e apenas o PostgreSQL está em Docker, configure `backend/.env` com `localhost`:

```env
DATABASE_URL=postgresql://john_doe:john_doe_password@localhost:5432/john_doe_registration?schema=public
```

Backend:

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Endpoints

### GET `/health`

Retorna a saúde básica da API.

```json
{ "status": "ok" }
```

### GET `/colors`

Retorna apenas cores ativas.

```json
[
  {
    "id": "color-id",
    "name": "Azul",
    "value": "blue",
    "hex": "#0000FF"
  }
]
```

### POST `/clients`

Cadastra um cliente.

Request:

```json
{
  "fullName": "John Doe",
  "cpf": "52998224725",
  "email": "john@email.com",
  "favoriteColorId": "color-id",
  "observations": "Observação opcional"
}
```

Respostas principais:

```text
201 Created      { "message": "Cliente cadastrado com sucesso." }
400 Bad Request  { "message": "Dados inválidos." }
409 Conflict     { "message": "Cliente já cadastrado." }
```

## Testes

Backend:

```bash
cd backend
npm run lint
npm test
npm run test:e2e
npm run build
```

Frontend:

```bash
cd frontend
npm run lint
npm test
npm run build
```

Os testes unitários do backend usam mocks quando validam service/controller. Os testes de integração do backend usam PostgreSQL real e Prisma real, com dados limpos entre cenários.

Os testes do frontend usam Vitest e Testing Library, mockando HTTP para validar o fluxo do usuário sem depender da API real.

## Decisões Técnicas

### NestJS

NestJS foi escolhido para organizar o backend em módulos, controllers, services e providers. A escolha favorece manutenção, testes e continuidade por outra equipe, sem adicionar funcionalidades fora do escopo.

### CPF Como Identificador Único

O requisito informa que um cliente deve conseguir realizar apenas um cadastro. Como o CPF é o identificador individual disponível no formulário, ele foi utilizado como chave de unicidade da regra de negócio.

No Prisma:

```prisma
cpf String @unique
```

### Cores Vindas Do Backend

Como as cores disponíveis podem mudar futuramente, a lista foi centralizada no backend e disponibilizada ao frontend por `GET /colors`.

O frontend não mantém uma lista fixa de cores. Ele exibe `name` para o usuário e envia `id` como `favoriteColorId`.

### Tabela `Color` E Chave Estrangeira

As cores foram modeladas na tabela `Color`, e o cliente salva `favoriteColorId` como chave estrangeira. Isso mantém integridade referencial e permite evoluir a lista de cores sem reescrever o formulário inteiro.

### Disponibilidade De Cores

O campo `isActive` em `Color` permite ocultar uma cor do formulário sem apagar registros históricos ou quebrar referências existentes.

### Validação Nos Dois Lados

O frontend valida para melhorar a experiência do usuário. O backend mantém a validação como fonte de verdade e nunca confia apenas no frontend.

O CPF é validado de verdade nos dois lados:

- remove máscara;
- valida quantidade de dígitos;
- rejeita sequências repetidas;
- valida dígitos verificadores.

### Normalização

Antes da persistência, o backend normaliza:

- `fullName`: `trim`;
- `email`: `trim` e `lowercase`;
- `cpf`: somente números;
- `observations`: `trim` quando informado.

### Observações

O campo é opcional e tem limite de 5000 caracteres.

### CORS

O backend configura CORS somente para a origem necessária do frontend:

```text
FRONTEND_URL=http://localhost:5173
```

### Docker

Toda a aplicação sobe com Docker Compose. O backend garante migrations e seed inicial de cores durante a inicialização do container.

### Healthcheck

`GET /health` foi incluído para validar rapidamente se a API está ativa em Docker, ambiente local ou hospedagem futura.

## Autoria

Desenvolvido por Jessica Woytuski.
