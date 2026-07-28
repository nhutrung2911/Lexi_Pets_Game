-- Migration 002: Create pet_stages table

CREATE TABLE IF NOT EXISTS public.pet_stages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pet_species_id UUID NOT NULL REFERENCES public.pet_species(id) ON DELETE CASCADE,
    stage INTEGER NOT NULL,
    stage_name TEXT NOT NULL,
    image_url TEXT NOT NULL,
    unlock_level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security
ALTER TABLE public.pet_stages ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access for all authenticated users on pet_stages" 
ON public.pet_stages
FOR SELECT 
TO authenticated 
USING (true);
