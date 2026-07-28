-- Migration: Upgrade Vocabulary Table to a Full Data Bank
-- Adds rich media, examples, difficulty, and exp fields.

-- 1. Add new columns
ALTER TABLE public.vocabulary ADD COLUMN IF NOT EXISTS category text DEFAULT 'General';
ALTER TABLE public.vocabulary ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.vocabulary ADD COLUMN IF NOT EXISTS audio_url text;
ALTER TABLE public.vocabulary ADD COLUMN IF NOT EXISTS example_en text;
ALTER TABLE public.vocabulary ADD COLUMN IF NOT EXISTS example_vi text;
ALTER TABLE public.vocabulary ADD COLUMN IF NOT EXISTS difficulty integer DEFAULT 1;
ALTER TABLE public.vocabulary ADD COLUMN IF NOT EXISTS exp_reward integer DEFAULT 10;

-- 2. Update default difficulty and exp based on levels
-- A1
UPDATE public.vocabulary SET difficulty = 1, exp_reward = 10 WHERE level = 'A1';
-- A2
UPDATE public.vocabulary SET difficulty = 2, exp_reward = 20 WHERE level = 'A2';
-- B1
UPDATE public.vocabulary SET difficulty = 3, exp_reward = 40 WHERE level = 'B1';
-- B2
UPDATE public.vocabulary SET difficulty = 4, exp_reward = 60 WHERE level = 'B2';
-- C1
UPDATE public.vocabulary SET difficulty = 5, exp_reward = 80 WHERE level = 'C1';
-- C2
UPDATE public.vocabulary SET difficulty = 6, exp_reward = 100 WHERE level = 'C2';

-- 3. Update sample record (ADVENTURE) as requested in the mockup
UPDATE public.vocabulary
SET 
  category = 'Travel',
  image_url = 'adventure.png',
  audio_url = 'adventure.mp3',
  example_en = 'We went on an exciting adventure.',
  example_vi = 'Chúng tôi đã có một chuyến phiêu lưu đầy thú vị.'
WHERE word = 'ADVENTURE';
