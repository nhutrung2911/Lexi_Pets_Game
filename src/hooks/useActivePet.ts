import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

export interface PetSpecies {
  id: string;
  name: string;
  element: string;
  rarity: string;
}

export interface PetStage {
  id: string;
  stage: number;
  stage_name: string;
  image_url: string;
  unlock_level?: number;
}

export interface UserPet {
  id: string;
  user_id: string;
  current_stage: number;
  level: number;
  exp: number;
  energy: number;
  happiness: number;
  hunger: number;
  equipped: boolean;
  species: PetSpecies;
  stage_info: PetStage | null;
}

export function useActivePet() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['activePet', user?.id],
    queryFn: async (): Promise<UserPet | null> => {
      if (!user) return null;

      // 1. Get the equipped pet
      const { data: petData, error: petError } = await supabase
        .from('user_pets')
        .select(`
          *,
          species:pet_species_id (
            id, name, element, rarity
          )
        `)
        .eq('user_id', user.id)
        .eq('equipped', true)
        .maybeSingle();

      if (petError) throw new Error(petError.message);
      
      if (!petData) {
        return null;
      }

      // 2. Get the specific stage info
      const { data: stageData, error: stageError } = await supabase
        .from('pet_stages')
        .select('*')
        .eq('pet_species_id', petData.pet_species_id)
        .eq('stage', petData.current_stage)
        .maybeSingle();

      if (stageError) throw new Error(stageError.message);

      return {
        ...petData,
        species: Array.isArray(petData.species) ? petData.species[0] : petData.species,
        stage_info: stageData,
      } as UserPet;
    },
    enabled: !!user,
  });
}
