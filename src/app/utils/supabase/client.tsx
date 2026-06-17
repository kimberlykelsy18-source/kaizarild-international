import { createClient } from '@supabase/supabase-js';
import { publicAnonKey } from './info';

// Create a singleton Supabase client instance
// This prevents multiple GoTrueClient instances warning
export const supabase = createClient(
  'https://npogbtrqxklvjiwgvcys.supabase.co',
  publicAnonKey
);
