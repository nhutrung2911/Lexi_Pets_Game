import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wvdevflcstbkbrzvcvst.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_5TOfFHiAYqZwV26wEWUEyA_VrJoAcM6';

export const supabase = createClient(supabaseUrl, supabaseKey);
