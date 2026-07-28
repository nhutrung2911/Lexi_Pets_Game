-- Migration 001: Create pet_species table

CREATE TABLE IF NOT EXISTS public.pet_species (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    element TEXT NOT NULL,
    rarity TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security
ALTER TABLE public.pet_species ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access for all authenticated users on pet_species" 
ON public.pet_species
FOR SELECT 
TO authenticated 
USING (true);

-- (Optional) If you want anonymous users to also read:
-- CREATE POLICY "Allow read access for public on pet_species" ON public.pet_species FOR SELECT USING (true);
