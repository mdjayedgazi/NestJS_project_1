# HelpDesk Ticket API

A RESTful ticket-management API built with **NestJS** and **TypeScript**. The project demonstrates NestJS controllers, services, DTO validation, middleware, interceptors, route guards, and HTTP exception handling.

> **Project status:** Learning project with in-memory sample data. It does not currently use a database or persistent storage.

## Features

- List all tickets and filter them by status or priority.
- Retrieve an individual ticket by ID.
- Create tickets with request-body validation.
- Update an open ticket.
- Close a ticket through a staff-protected endpoint.
- Validate incoming query parameters and request bodies with `class-validator`.
- Log incoming ticket requests with NestJS middleware.
- Wrap successful responses in a consistent response envelope.
- Parse ticket IDs as integers and return appropriate HTTP exceptions for invalid or missing tickets.

## Tech Stack

- [NestJS 12](https://nestjs.com/) — Node.js application framework
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/) — HTTP platform
- [class-validator](https://github.com/typestack/class-validator) and [class-transformer](https://github.com/typestack/class-transformer) — DTO validation
- [pnpm](https://pnpm.io/) — package manager
- [Vitest](https://vitest.dev/) and [Supertest](https://github.com/ladjs/supertest) — testing tools
- [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) — linting
- [Prettier](https://prettier.io/) — code formatting

## Requirements

- Node.js (Node.js 24 is recommended for this project)
- pnpm

Check that they are installed:

```bash
node --version
pnpm --version
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mdjayedgazi/NestJS_project_1.git
cd NestJS_project_1
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure the environment

The application reads `PORT` from the environment and defaults to `3000`. The development scripts also load a `.env` file.

Create a local `.env` file in the project root:

```env
PORT=3000
```

### 4. Start the application

```bash
# Development mode with watch
pnpm run start:dev

# Standard start
pnpm run start

# Build and run the production output
pnpm run build
pnpm run start:prod
```

The API will be available at:

```text
http://localhost:3000/api
```

The port changes when you set a different `PORT` value in `.env`.

## API Reference

All routes use the `/api` global prefix.

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `GET` | `/api/tickets` | List tickets; supports `status` and `priority` filters | Public |
| `GET` | `/api/tickets/:id` | Get one ticket by ID | Public |
| `POST` | `/api/tickets` | Create a ticket | Public |
| `PATCH` | `/api/tickets/:id` | Update an open ticket | Public |
| `PATCH` | `/api/tickets/:id/close` | Close a ticket | Staff key required |

### Ticket fields

A ticket has the following shape:

```json
{
  "id": 1,
  "subject": "Login issue",
  "description": "Unable to log into my account.",
  "priority": "high",
  "status": "open",
  "createdAt": "2026-11-09T08:15:00.000Z"
}
```

Allowed values:

- `priority`: `low`, `medium`, or `high`
- `status`: `open` or `closed`

The service currently starts with sample tickets stored in memory. New tickets receive an ID and timestamp from the service, and their initial status is `open`.

### List and filter tickets

```bash
# List all tickets
curl http://localhost:3000/api/tickets

# Only open tickets
curl "http://localhost:3000/api/tickets?status=open"

# High-priority open tickets
curl "http://localhost:3000/api/tickets?status=open&priority=high"
```

### Get a ticket

```bash
curl http://localhost:3000/api/tickets/1
```

### Create a ticket

`subject`, `description`, and `priority` are required.

```bash
curl -X POST http://localhost:3000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Cannot reset password",
    "description": "The password reset email never arrives.",
    "priority": "medium"
  }'
```

### Update a ticket

All update fields are optional. Closed tickets cannot be updated.

```bash
curl -X PATCH http://localhost:3000/api/tickets/1 \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Unable to sign in",
    "priority": "high"
  }'
```

### Close a ticket

This route is protected by `StaffGuard`. The current guard checks the `x-access-token` request header against a hard-coded development key in `src/tickets/guards/staff.guard.ts`.

```bash
curl -X PATCH http://localhost:3000/api/tickets/1/close \
  -H "x-access-token: helpdesk-staff-secret"
```

> **Security note:** The hard-coded staff key is only suitable for this learning example. Do not use it in a deployed application. Move secrets into environment variables and use a proper authentication and authorization strategy before exposing staff routes publicly.

## Responses and Validation

Successful responses are wrapped by the global response interceptor in this format:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "subject": "Login issue",
    "description": "Unable to log into my account.",
    "priority": "high",
    "status": "open",
    "createdAt": "2026-11-09T08:15:00.000Z"
  }
}
```

The global `ValidationPipe` is configured with:

- `whitelist: true` — allows only properties that have validation decorators.
- `forbidNonWhitelisted: true` — rejects requests containing unexpected properties instead of silently stripping them.

Ticket IDs are parsed with `ParseIntPipe`. The service uses NestJS exceptions for cases such as missing tickets, invalid updates, and attempts to close an already-closed ticket.

## Project Structure

```text
src/
├── common/
│   ├── request-logger.middleware.ts
│   └── response.interceptor.ts
├── tickets/
│   ├── dto/
│   │   ├── create-ticket.dto.ts
│   │   ├── filter-tickets-query.dto.ts
│   │   └── update-ticket.dto.ts
│   ├── guards/
│   │   └── staff.guard.ts
│   ├── ticket.interface.ts
│   ├── tickets.controller.ts
│   ├── tickets.module.ts
│   └── tickets.service.ts
├── app.module.ts
└── main.ts

test/
└── app.e2e-spec.ts
```

## Development Commands

```bash
# Start in watch mode
pnpm run start:dev

# Build the application
pnpm run build

# Run unit tests
pnpm run test

# Run unit tests in watch mode
pnpm run test:watch

# Run end-to-end tests
pnpm run test:e2e

# Generate test coverage
pnpm run test:cov

# Lint source and test files
pnpm run lint

# Format TypeScript files
pnpm run format
```

## Current Limitations

- **In-memory storage:** Ticket records are held in an array inside `TicketsService`. Changes are lost when the server restarts.
- **No database integration:** There is currently no PostgreSQL, ORM, or migration setup.
- **Demo staff guard:** The staff key is hard-coded and is not production-grade authentication.
- **Test scaffold:** Review and adapt the starter end-to-end test as the ticket API evolves.

## Learning Goals

This project is intended to practice core backend concepts with NestJS:

- Modules, controllers, and dependency-injected services
- DTOs and request validation
- Middleware and interceptors
- Guards and route-level access control
- Route parameters, query parameters, and HTTP methods
- HTTP status codes and exception handling
- Basic unit and end-to-end testing

## Author

**Md. Jayed Gazi**

- GitHub: [@mdjayedgazi](https://github.com/mdjayedgazi)
- Repository: [NestJS_project_1](https://github.com/mdjayedgazi/NestJS_project_1)

---

Built as a hands-on NestJS backend learning project.
