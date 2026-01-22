# Bulltrack Pro

Advanced bovine genetic ranking platform for cattle producers. This project is a full-stack application built with Next.js 14, NestJS, GraphQL, and PostgreSQL.

## Live Demo

- **Frontend:** [https://bulltrack-pro.vercel.app](https://bulltrack-pro.vercel.app) _(actualizar con tu URL)_
- **Backend GraphQL Playground:** [https://bulltrack-backend.railway.app/graphql](https://bulltrack-backend.railway.app/graphql) _(actualizar con tu URL)_

## Project Structure

```
bulltrack-pro/
├── backend/                    # NestJS + GraphQL + PostgreSQL
│   ├── src/
│   │   ├── auth/              # Authentication module (JWT)
│   │   ├── bulls/             # Bulls module (CRUD + filters)
│   │   ├── favorites/         # Favorites module (user-bull relationship)
│   │   ├── common/            # Shared DTOs, decorators, guards
│   │   └── database/          # TypeORM entities + auto-init
│   └── sql/                   # Database scripts (reference)
│
├── frontend/                   # Next.js 14 + App Router + Tailwind
│   ├── src/
│   │   ├── app/               # Pages (login, dashboard)
│   │   ├── components/        # UI components
│   │   ├── hooks/             # Custom hooks (auth, filters)
│   │   ├── lib/               # Apollo client, utilities
│   │   └── types/             # TypeScript types
│
└── package.json               # Root workspace config
```

## Tech Stack

### Backend
- **Framework:** NestJS 11
- **API:** GraphQL (Apollo Server)
- **Database:** PostgreSQL with TypeORM
- **Authentication:** JWT (Passport.js)

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **API Client:** Apollo Client
- **Language:** TypeScript

## Getting Started (Local Development)

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Quick Start

1. **Clone and install dependencies:**

```bash
git clone <repo-url>
cd bulltrack-pro
npm install
```

2. **Setup Backend:**

```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npm run start:dev
```

The backend will automatically create tables and seed data on first run.

3. **Setup Frontend:**

```bash
cd frontend
cp .env.example .env.local
npm run dev
```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - GraphQL Playground: http://localhost:4000/graphql

## Default Credentials

- **Email:** admin@seed28.com
- **Password:** seed28

---

## Deployment Guide

### Option 1: Railway (Backend) + Vercel (Frontend)

#### Deploy Backend to Railway

1. Create a new project in [Railway](https://railway.app)
2. Add a PostgreSQL database service
3. Add a new service from your GitHub repo (select the `backend` folder)
4. Set environment variables:
   ```
   NODE_ENV=production
   JWT_SECRET=your-secure-secret-key
   JWT_EXPIRES_IN=7d
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   PORT=4000
   ```
5. Railway will automatically build and deploy

#### Deploy Frontend to Vercel

1. Import your repo to [Vercel](https://vercel.com)
2. Set the root directory to `frontend`
3. Add environment variable:
   ```
   NEXT_PUBLIC_GRAPHQL_URL=https://your-backend.railway.app/graphql
   ```
4. Deploy

### Option 2: Render

#### Deploy Backend to Render

1. Create a new Web Service in [Render](https://render.com)
2. Connect your GitHub repo
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
4. Add a PostgreSQL database
5. Set environment variables (same as Railway)

#### Deploy Frontend to Render

1. Create a new Static Site
2. Configure:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `.next`
3. Add environment variable: `NEXT_PUBLIC_GRAPHQL_URL`

---

## Architectural Choices

### Backend Architecture

1. **GraphQL over REST:** Chosen for its native support of cursor-based pagination and flexible querying. The client can request exactly the data it needs, reducing over-fetching.

2. **Cursor-based Pagination:** Implemented using a composite cursor (id + score) to ensure stable pagination even when sorting by calculated fields like `bullScore`.

3. **Calculated Bull Score:** The score is computed dynamically using the formula:
   ```
   Score = (C × 0.30) + (F × 0.25) + (R × 0.20) + (M × 0.15) + (Ca × 0.10)
   ```
   Where C=Crecimiento, F=Facilidad de Parto, R=Reproduccion, M=Moderacion, Ca=Carcasa

4. **Database Indexing Strategy:**
   - Composite index on `(origen, uso, pelaje)` for filter queries
   - Expression index on calculated score for efficient sorting
   - Individual indexes on `caravana`, `origen`, `uso`, `pelaje`

5. **Auto-initialization:** The database schema and seed data are created automatically on first startup, making deployment seamless.

### Frontend Architecture

1. **Zustand for State Management:** Lightweight and simple state management for filters and authentication state. Chosen over Redux for its minimal boilerplate.

2. **Apollo Client Caching:** Configured with field policies to handle cursor-based pagination correctly, merging new pages with existing data.

3. **Component Structure (Atomic Design):**
   - `ui/` - Atoms (Button, Input, Badge, Toggle, Select)
   - `bulls/` - Molecules (BullCard, BullList, SearchBar, RadarChart)
   - `layout/` - Organisms (Header, Sidebar)

---

## API Endpoints

### Queries

```graphql
# Get paginated bulls with filters
query GetBulls($input: BullsQueryInput) {
  bulls(input: $input) {
    edges {
      node {
        id
        caravana
        nombre
        bullScore
        isFavorite
        stats { ... }
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}

# Get current user
query Me {
  me {
    id
    email
    name
  }
}
```

### Mutations

```graphql
# Login
mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
    user {
      id
      email
      name
    }
  }
}

# Toggle favorite
mutation ToggleFavorite($input: ToggleFavoriteInput!) {
  toggleFavorite(input: $input) {
    bullId
    isFavorite
  }
}
```

---

## Future Improvements

Given 2 more weeks, I would implement:

1. **Performance Optimizations:**
   - Redis caching for frequently accessed data
   - Database connection pooling optimization
   - Implement DataLoader for N+1 query prevention

2. **Additional Features:**
   - User registration flow
   - Bull comparison feature (side-by-side view)
   - Export functionality (PDF/Excel)
   - Advanced filtering (date ranges, multiple criteria)

3. **Testing:**
   - Unit tests for services and resolvers
   - E2E tests with Playwright
   - Integration tests for GraphQL queries

4. **Infrastructure:**
   - Docker Compose setup for development
   - CI/CD pipeline with GitHub Actions
   - Database migrations with TypeORM

5. **UI/UX Improvements:**
   - Mobile responsive design
   - Dark/Light theme toggle
   - Loading skeleton improvements
   - Toast notifications for actions

---

## Handling 100,000+ Records

For scaling to 100k+ bull records:

1. **Database Level:**
   - Proper indexing on all filter columns (already implemented)
   - Expression index for calculated score
   - Consider partitioning by `origen` or `created_at`
   - Regular ANALYZE and VACUUM

2. **Application Level:**
   - Cursor-based pagination (already implemented)
   - Add caching layer (Redis)
   - Use database views for complex aggregations
   - Consider read replicas for heavy read workloads

3. **Search Optimization:**
   - Full-text search with PostgreSQL `pg_trgm`
   - Consider Elasticsearch for advanced search requirements
   - Typeahead/autocomplete with debouncing (implemented in frontend)

---

## License

MIT
