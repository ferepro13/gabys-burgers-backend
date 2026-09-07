# Gaby's Burgers Backend

REST API for Gaby's Burgers.

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

## Architecture

controllers/
models/
routes/
services/
middlewares/
utils/
database/

## API

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

## Environment Variables

See `.env.example`.

## Installation

pnpm install

## Development

pnpm dev

## Production

pnpm start