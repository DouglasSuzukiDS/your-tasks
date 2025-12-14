# 📝 Your Tasks

![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=fff)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=fff)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff)
![JWT](https://img.shields.io/badge/JWT-000?logo=jsonwebtokens&logoColor=fff)

## 📚 Sobre

O **YourTasks** é uma aplicação web para gerenciamento de tarefas, com autenticação de usuários, interface e API. O projeto utiliza Next.js, Prisma ORM, autenticação JWT e banco de dados PostgreSQL.

---

## 🚀 Funcionalidades

- 👤 Cadastro e login de usuários
- 🔒 Autenticação segura via JWT
- 🗂️ CRUD de tarefas (criar, listar, atualizar, remover)
- 💡 Interface responsiva e amigável
- 📄 API documentada com Swagger

---

## 🛠️ Tecnologias

- **Next.js** — Framework React para SSR/SSG
- **TypeScript** — Tipagem estática para JavaScript
- **Prisma** — ORM para manipulação do Banco de Dados (PostgreSQL)
- **JWT** — Autenticação
- **Bcrypt** - Criptografia de senha
- **Docker** — Containerização do ambiente
- **Swagger** — Documentação da API

---

## 🧑‍💻 Como rodar o projeto

1. **Clone o repositório:**
   ```
   git clone https://https://github.com/DouglasSuzukiDS/your-tasks

   cd your-tasks
   ```

2. **Instale as dependências:**
   ```
   npm install
   ```

3. **Configure o banco de dados:**
   - Edite o arquivo `.envExample` com as credenciais do seu banco.
   - Rode as migrações:
     ```
     npx prisma migrate deploy
     ```

4. **Suba o ambiente com Docker:**
   ```
   docker-compose up -d
   ```

5. **Inicie o servidor:**
   ```
   npm run dev
   ```
---

## 📖 Documentação da API

Acesse a documentação Swagger **NÃO FUNCIONA AINDA**:  
`/swagger.yaml` ou configure um Swagger UI apontando para esse arquivo.

---