import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

interface UserProfile {
  id: string;
  username: string;
  coins: number;
  gems: number; // Added for Milestone 4
}

export function useProfile() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user) return null;

      // In a real app, you'd insert a default profile on signup via Postgres triggers.
      // Here we do a select and fallback to default if not found.
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw new Error(error.message);
      }

      // If no profile, return a default mock so UI doesn't break
      return data || { id: user.id, username: user.email?.split('@')[0] || 'Player', coins: 0, gems: 0 };
    },
    enabled: !!user,
  });
}
