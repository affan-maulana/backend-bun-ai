# BUNCHAT AI BACKEND

BunChat AI Backend is a backend service for AI chat, integrated with ChatGPT.

## Prerequisites

Ensure you have the following installed before proceeding:
- [Bun](https://bun.sh/docs/installation)
- [Node.js](https://nodejs.org/) (if deploying on Docker)
- [PostgreSQL](https://www.postgresql.org/) or any supported database
- [Prisma](https://www.prisma.io/) for database management

## Installation

### 1. Clone the repository
```sh
git clone https://github.com/affan-maulana/backend-bun-ai.git
cd backend-bun-ai
```

### 2. Copy environment variables
```sh
cp .env.example .env
```
Modify `.env` with your database and API key configurations.

### 3. Install dependencies
```sh
bun install
```

### 4. Run database migrations
```sh
bunx prisma migrate dev --name init
```

## Running the Server

To start the backend server, run:
```sh
bun run src/index.ts
```

For development with hot reload:
```sh
bun dev
# or
bun run dev
```

## Deploying on Docker

Make sure Node.js is installed in the container:
```sh
node -v
npm -v
```
Then, build and run the container:
```sh
docker build -t bunchat-backend .
docker run -p 3002:3002 bunchat-backend
```

## API Documentation

You can import the Postman collection to test the API:

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.postman.com/downloads/)

### Import API Collection
1. Download the collection: [postman_collection.json](postman_collection.json)
2. Open Postman
3. Click "Import" and select the downloaded JSON file

Once imported, you can test the API endpoints easily in Postman.

## Contributing
Feel free to open issues or submit pull requests.

