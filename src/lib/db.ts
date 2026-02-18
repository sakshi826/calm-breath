import { supabase, setUserContext } from './supabase';

export interface BreathingSession {
    id?: string;
    started_at: string;
    technique: string;
    duration_min: number;
    completed: boolean;
    rating?: number;
    notes?: string;
}

export interface BreathingSettings {
    default_technique: string;
    default_duration: number;
    sound_enabled: boolean;
    vibration_enabled: boolean;
    daily_goal: number;
}

export async function upsertUser(userId: number): Promise<void> {
    await setUserContext(userId);
    const { error } = await supabase.from('users').upsert({ id: userId }, { onConflict: 'id' });
    if (error) throw error;
}

export async function saveBreathingSession(userId: number, session: BreathingSession) {
    await setUserContext(userId);
    const { error } = await supabase.from('breathing_sessions').insert({
        user_id: userId,
        ...session
    });
    if (error) throw error;
}

export async function getBreathingSessions(userId: number): Promise<BreathingSession[]> {
    await setUserContext(userId);
    const { data, error } = await supabase
        .from('breathing_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function deleteBreathingSession(userId: number, id: string) {
    await setUserContext(userId);
    const { error } = await supabase
        .from('breathing_sessions')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

    if (error) throw error;
}

export async function saveBreathingSettings(userId: number, settings: BreathingSettings) {
    await setUserContext(userId);
    const { error } = await supabase
        .from('breathing_settings')
        .upsert({ user_id: userId, ...settings }, { onConflict: 'user_id' });

    if (error) throw error;
}

export async function getBreathingSettings(userId: number): Promise<BreathingSettings | null> {
    await setUserContext(userId);
    const { data, error } = await supabase
        .from('breathing_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
}
