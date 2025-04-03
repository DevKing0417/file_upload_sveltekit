# Resource Management System

A modern web application for managing and sharing resources, built with SvelteKit, Prisma, and PostgreSQL.

## Features

- Resource upload and management
- File type validation
- Search and filtering
- Role-based access
- Multi-language support
- View tracking
- Mobile-responsive design

## Prerequisites

- Node.js (v18.0.0 or higher)
- npm or pnpm (we recommend pnpm for faster installation)
- Docker and Docker Compose (for containerized setup)
- PostgreSQL (v14 or higher, if not using Docker)

## Getting Started

### Option 1: Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Copy the environment file:
```bash
cp .env.example .env
```

3. **IMPORTANT**: Ensure your `.env` file contains all required variables:
```
# Database connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pack_db"

# File upload settings (REQUIRED)
UPLOAD_DIR="static/uploads"
MAX_FILE_SIZE="100000000"  # 100MB in bytes
```

4. Start the Docker containers:
```bash
docker-compose up -d
```

5. Install dependencies:
```bash
pnpm install
# or
npm install
```

6. Run database migrations:
```bash
pnpm prisma migrate dev
# or
npx prisma migrate dev
```

7. Start the development server:
```bash
pnpm dev
# or
npm run dev
```

The application will be available at `http://localhost:5173`

### Option 2: Local Setup (Without Docker)

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Copy the environment file:
```bash
cp .env.example .env
```

3. **IMPORTANT**: Update the environment variables in `.env`:
```
# Database connection
DATABASE_URL="postgresql://username:password@localhost:5432/pack_db"

# File upload settings (REQUIRED)
UPLOAD_DIR="static/uploads"
MAX_FILE_SIZE="100000000"  # 100MB in bytes
```

4. Create the upload directory:
```bash
mkdir -p static/uploads
```

5. Install dependencies:
```bash
pnpm install
# or
npm install
```

6. Set up the database:
```bash
# Create the database
createdb pack_db

# Run migrations
pnpm prisma migrate dev
# or
npx prisma migrate dev
```

7. Start the development server:
```bash
pnpm dev
# or
npm run dev
```

The application will be available at `http://localhost:5173`

## Common Issues and Solutions

### Missing UPLOAD_DIR Environment Variable

If you encounter errors related to file uploads, check that your `.env` file includes:
```
UPLOAD_DIR="static/uploads"
```

### Docker Setup Issues

1. **Port conflicts**: If you see errors about ports being in use:
   ```bash
   # Check what's using the ports
   lsof -i :5432
   lsof -i :5173
   
   # Stop the conflicting services or change ports in docker-compose.yml
   ```

2. **Container not starting**: 
   ```bash
   # Check container logs
   docker-compose logs
   
   # Restart containers
   docker-compose down
   docker-compose up -d
   ```

3. **Database connection issues**:
   - Ensure PostgreSQL container is running: `docker-compose ps`
   - Check database URL in `.env` matches Docker setup
   - Try resetting the database: `npx prisma migrate reset`

### File Upload Issues

1. **Permission errors**:
   ```bash
   # Ensure upload directory exists and has proper permissions
   mkdir -p static/uploads
   chmod 755 static/uploads
   ```

2. **File size limits**:
   - Check `MAX_FILE_SIZE` in `.env` is set appropriately
   - Default is 100MB (100000000 bytes)

## Project Structure

```
my-svelte-app/
├── src/
│   ├── lib/             # Shared components and utilities
│   ├── routes/          # SvelteKit routes and API endpoints
│   └── app.css         # Global styles
├── static/             # Static assets
│   └── uploads/        # Uploaded files directory
├── prisma/            # Database schema and migrations
├── .env.example        # Example environment variables
├── .env                # Environment variables
├── docker-compose.yml  # Docker configuration
├── package.json        # Project metadata and dependencies
└── README.md           # Project documentation
```

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow SvelteKit's file-based routing conventions
- Use Tailwind CSS for styling
- Implement responsive design patterns

### Database

- Use Prisma as the ORM
- Create migrations for all database changes
- Follow naming conventions for tables and columns

### API Endpoints

All API endpoints are located in `src/routes/api/` following SvelteKit's routing conventions:

- GET `/api/resources` - List all resources
- POST `/api/resources` - Create a new resource
- GET `/api/resources/[id]` - Get a specific resource
- POST `/api/resources/[id]/view` - Increment view count

## Testing

```bash
# Run tests
pnpm test
# or
npm run test
```

### Pre-Review Checklist

Before submitting for review, ensure:

1. All environment variables are properly set in `.env`
2. The upload directory exists and has proper permissions
3. Docker containers start without errors
4. Database migrations run successfully
5. File uploads work correctly
6. The application runs without console errors

## Building for Production

```bash
# Build the application
pnpm build
# or
npm run build

# Preview the production build
pnpm preview
# or
npm run preview
```

