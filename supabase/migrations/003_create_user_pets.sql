-- Migration 003: Create user_pets table

CREATE TABLE IF NOT EXISTS public.user_pets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pet_species_id UUID NOT NULL REFERENCES public.pet_species(id) ON DELETE CASCADE,
    current_stage INTEGER DEFAULT 1,
    level INTEGER DEFAULT 1,
    exp INTEGER DEFAULT 0,
    energy INTEGER DEFAULT 100,
    happiness INTEGER DEFAULT 100,
    hunger INTEGER DEFAULT 100,
    equipped BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security
ALTER TABLE public.user_pets ENABLE ROW LEVEL SECURITY;

-- Users can only select their own pets
CREATE POLICY "Users can view their own pets" 
ON public.user_pets
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Users can only insert their own pets
CREATE POLICY "Users can insert their own pets" 
ON public.user_pets
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own pets
CREATE POLICY "Users can update their own pets" 
ON public.user_pets
FOR UPDATE
TO authenticated 
USING (auth.uid() = user_id);
