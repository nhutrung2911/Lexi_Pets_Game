# LexiPets Coding Rules

- **React + TypeScript only**: No plain JavaScript (.js or .jsx) unless absolutely necessary for external non-typed libs.
- **No hardcoded data**: Pet data must come from Supabase.
- **No DOM manipulation**: Do not use `document.getElementById`, `querySelector`, or manual class toggling. Rely on React state and refs.
- **No inline SQL**: All SQL should be in Supabase Migrations (`supabase/migrations/`).
- **Use Service Layer**: API calls to Supabase should be placed in `src/services` or `src/lib`.
- **Use TanStack Query**: For all asynchronous data fetching, caching, and synchronization.
- **Use Zustand**: For global client UI state (e.g., active modal, current theme) that doesn't need to be persisted to DB immediately.
- **Use Supabase Storage**: For all pet and item images. No images stored locally in `src/assets` except basic UI icons/logos.
- **Use Supabase Auth**: For authentication. No custom local storage user logic.
- **Use Tailwind CSS v4**: For all styling. Do not write vanilla CSS files for layout/components.
- **Game Logic Separation**: The core word search game logic must be pure functions inside `src/utils`, not tightly coupled to React components.
