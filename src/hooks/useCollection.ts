import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { PetSpecies, PetStage, UserPet } from './useActivePet';

export interface CollectionItem {
  species: PetSpecies;
  stages: PetStage[];
  userPet: UserPet | null; // null if not unlocked
}

export function useCollection() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const collectionQuery = useQuery({
    queryKey: ['collection', user?.id],
    queryFn: async (): Promise<CollectionItem[]> => {
      if (!user) return [];

      // Fetch all species and their stages
      const { data: speciesData, error: speciesError } = await supabase
        .from('pet_species')
        .select(`
          *,
          stages:pet_stages (*)
        `)
        .order('name');

      if (speciesError) throw new Error(speciesError.message);

      // Fetch user's unlocked pets
      const { data: userPetsData, error: userPetsError } = await supabase
        .from('user_pets')
        .select('*')
        .eq('user_id', user.id);

      if (userPetsError) throw new Error(userPetsError.message);

      // Map them together
      return speciesData.map((species: any) => {
        const userPet = userPetsData.find(up => up.pet_species_id === species.id) || null;
        
        // Sort stages by stage number
        const sortedStages = species.stages.sort((a: any, b: any) => a.stage - b.stage);

        return {
          species: {
            id: species.id,
            name: species.name,
            element: species.element,
            rarity: species.rarity
          },
          stages: sortedStages,
          userPet
        };
      });
    },
    enabled: !!user,
  });

  const equipPetMutation = useMutation({
    mutationFn: async (userPetId: string) => {
      if (!user) throw new Error('Not authenticated');

      // First, unequip all pets for this user
      await supabase
        .from('user_pets')
        .update({ equipped: false })
        .eq('user_id', user.id);

      // Then equip the selected one
      const { error } = await supabase
        .from('user_pets')
        .update({ equipped: true })
        .eq('id', userPetId);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activePet'] });
      queryClient.invalidateQueries({ queryKey: ['collection'] });
    }
  });

  const evolvePetMutation = useMutation({
    mutationFn: async ({ userPetId, newStage }: { userPetId: string, newStage: number }) => {
      const { error } = await supabase
        .from('user_pets')
        .update({ current_stage: newStage })
        .eq('id', userPetId);
        
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activePet'] });
      queryClient.invalidateQueries({ queryKey: ['collection'] });
    }
  });

  return {
    ...collectionQuery,
    equipPet: equipPetMutation.mutateAsync,
    isEquipping: equipPetMutation.isPending,
    evolvePet: evolvePetMutation.mutateAsync,
    isEvolving: evolvePetMutation.isPending,
  };
}
