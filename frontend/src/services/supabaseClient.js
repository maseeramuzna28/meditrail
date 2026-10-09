import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kgzjxxwqdsqiwwdnksvw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_gU18cKdt7KvCVb0cnf5a9w_rPbs1x3-';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
