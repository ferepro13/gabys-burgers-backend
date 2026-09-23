# Gaby's Burgers - Backend API

REST API for Gaby's Burgers, to handle products, extras, orders, delivery service, auth and metrics.

## Features

- Product management
- Extras management
- Order management
- JWT authentication
- Stock management
- Image processing
- Metrics (in development)

## Tech Stack

- Node.js
- Express
- MySQL
- JWT
- bcrypt
- Cloudinary
- Sharp

## API

### Authentication

POST /auth/login

### Products

GET /productos
GET /productos/:uuid
POST /productos
PUT /productos/:uuid
DELETE /productos/:uuid

### Extras

GET /extras
GET /extras/:uuid
POST /extras
PUT /extras/:uuid
DELETE /extras/:uuid

### Orders

GET /pedidos
POST /pedidos
PUT /pedidos/:uuid (change order state)
DELETE /pedidos/:uuid

### Deliveries

GET /domicilios
GET /domicilios/:uuid
POST /domicilios
PUT /domicilios/:uuid
DELETE /domicilios/:uuid

## Architecture

src/
|--- controllers/
|--- models/
|--- routes/
|--- services/
|--- middlewares/
|--- utils/
|--- database/

### Controllers

Receive the request and coordinate the operation.

### Models

Contain the operations related with the database queries.

### Services

Contain business logic that should live outside of the controllers.

### Routes

Define the HTTP endpoints

### Middlewares

Implement crossed responsibilities like authentication, error handling, etc.

## Environment Variables

See `.env.example`.

## Installation

pnpm install

## Development

pnpm dev

## Production

pnpm start

## Known Limitations

- Automated tests are not yet implemented.
- Backend validation is being hardened.
- Typescript migration is planned.