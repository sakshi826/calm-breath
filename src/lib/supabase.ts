import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fail-safe initialization: Use placeholder strings to prevent createClient from throwing
// while allowing the app to boot and show mock data instead of a blank screen.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder'
);

export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);

/**
 * Sets the RLS user context for the current request chain.
 * Must be called before any data operation.
 */
export async function setUserContext(userId: number): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.rpc('set_config', {
      setting_name: 'app.current_user_id',
      setting_value: String(userId),
      is_local: true,
    });
  } catch (e) {
    console.warn('Failed to set user context:', e);
  }
}