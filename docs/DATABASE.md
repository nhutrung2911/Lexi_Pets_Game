# LexiPets Supabase Database Schema

## 1. `pet_species`
Stores information about each pet species available in the game.

| Column      | Type      | Notes                                  |
|-------------|-----------|----------------------------------------|
| `id`        | uuid      | Primary Key, default gen_random_uuid() |
| `name`      | text      | e.g. "Fire Cat", "Wind Bird"           |
| `element`   | text      | e.g. "Fire", "Wind", "Earth"           |
| `rarity`    | text      | e.g. "Common", "Rare", "Epic"          |
| `description`| text     | Brief lore/info                        |
| `created_at`| timestamp | default now()                          |

## 2. `pet_stages`
Stores the evolution stages for each species.

| Column          | Type      | Notes                                       |
|-----------------|-----------|---------------------------------------------|
| `id`            | uuid      | Primary Key, default gen_random_uuid()      |
| `pet_species_id`| uuid      | Foreign Key -> pet_species.id               |
| `stage`         | integer   | 1, 2, 3, 4, etc.                            |
| `stage_name`    | text      | e.g. "Mèo Than Hồng" for stage 1            |
| `image_url`     | text      | Full URL to Supabase Storage Bucket `pets/` |
| `unlock_level`  | integer   | Level required to reach this stage          |
| `created_at`    | timestamp | default now()                               |

## 3. `user_pets`
Stores the pets owned by users.

| Column          | Type      | Notes                                            |
|-----------------|-----------|--------------------------------------------------|
| `id`            | uuid      | Primary Key, default gen_random_uuid()           |
| `user_id`       | uuid      | Foreign Key -> auth.users.id                     |
| `pet_species_id`| uuid      | Foreign Key -> pet_species.id                    |
| `current_stage` | integer   | Defaults to 1                                    |
| `level`         | integer   | Defaults to 1                                    |
| `exp`           | integer   | Defaults to 0                                    |
| `energy`        | integer   | Defaults to 100                                  |
| `happiness`     | integer   | Defaults to 100                                  |
| `hunger`        | integer   | Defaults to 100                                  |
| `equipped`      | boolean   | Is this the currently active pet? (Default false)|
| `created_at`    | timestamp | default now()                                    |

## RLS (Row Level Security) Policies
- `pet_species` & `pet_stages`: `SELECT` for all authenticated users. `INSERT/UPDATE/DELETE` for admins only.
- `user_pets`: Users can `SELECT`, `INSERT`, `UPDATE` only rows where `user_id = auth.uid()`.
