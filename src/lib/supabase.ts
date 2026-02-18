import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials missing. Data features will be disabled.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder'
);

export async function setUserContext(userId: number): Promise<void> {
  if (!supabaseUrl) return;
  await supabase.rpc('set_config', {
    setting_name: 'app.current_user_id',
    setting_value: String(userId),
    is_local: true,
  });
}