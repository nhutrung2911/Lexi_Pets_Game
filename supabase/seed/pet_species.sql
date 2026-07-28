-- Seed data for pet_species and pet_stages

-- Insert a default species: Fire Cat
INSERT INTO public.pet_species (id, name, element, rarity, description)
VALUES ('11111111-1111-1111-1111-111111111111', 'Fire Cat', 'Fire', 'Common', 'A warm and friendly cat made of fire.')
ON CONFLICT (id) DO NOTHING;

-- Insert stages for Fire Cat
INSERT INTO public.pet_stages (pet_species_id, stage, stage_name, image_url, unlock_level)
VALUES 
('11111111-1111-1111-1111-111111111111', 1, 'Mèo Than Hồng', 'pets/fire_cat/stage1.png', 1),
('11111111-1111-1111-1111-111111111111', 2, 'Mèo Lửa Ấm Áp', 'pets/fire_cat/stage2.png', 5),
('11111111-1111-1111-1111-111111111111', 3, 'Hổ Lửa', 'pets/fire_cat/stage3.png', 10),
('11111111-1111-1111-1111-111111111111', 4, 'Sư Tử Hỏa', 'pets/fire_cat/stage4.png', 20);

-- Insert another species: Wind Bird
INSERT INTO public.pet_species (id, name, element, rarity, description)
VALUES ('22222222-2222-2222-2222-222222222222', 'Wind Bird', 'Wind', 'Rare', 'A swift bird that rides the gentle breeze.')
ON CONFLICT (id) DO NOTHING;

-- Insert stages for Wind Bird
INSERT INTO public.pet_stages (pet_species_id, stage, stage_name, image_url, unlock_level)
VALUES 
('22222222-2222-2222-2222-222222222222', 1, 'Chim Gió Nhỏ', 'pets/wind_bird/stage1.png', 1),
('22222222-2222-2222-2222-222222222222', 2, 'Chim Gió Lớn', 'pets/wind_bird/stage2.png', 5);
