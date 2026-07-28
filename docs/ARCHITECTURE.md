# LexiPets System Architecture

## Overall Flow
```text
Frontend (React) 
    │
    │ (Supabase JS SDK)
    ▼
Service Layer (TanStack Query + Supabase JS)
    │
    ▼
Supabase
    ├── Authentication
    ├── PostgreSQL Database
    ├── Storage
    └── Realtime
```

## Layers & Responsibilities

1. **Frontend (React Component)**
   - Only responsible for Rendering UI.
   - Fetches data using Hooks (`useQuery`, `useMutation`).
   - Uses Zustand for client-only global states.
   - NO direct DOM manipulation, NO hardcoded data.

2. **Service Layer / Hooks (`src/lib`, `src/hooks`)**
   - Handles all data fetching and caching with TanStack Query.
   - Communicates with Supabase using the Supabase JS client.

3. **Utils / Game Engine (`src/utils`)**
   - Contains pure functions and logic for the game (e.g., Word Search algorithms, scoring).
   - Independent of React Components.

4. **Supabase (Backend)**
   - **Postgres**: Source of truth for all structured data (`pet_species`, `pet_stages`, `user_pets`).
   - **Storage**: Holds all pet images and static assets (no images stored locally in `src/assets`).
   - **Auth**: Handles user sessions.
