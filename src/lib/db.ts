import { supabase, setUserContext, isSupabaseConfigured } from './supabase';

export interface BreathingSession {
    id?: string;
    logged_at: string;
    duration_sec: number;
    activity_type: string;
}

const MOCK_SESSIONS: BreathingSession[] = [
    { logged_at: new Date().toISOString(), duration_sec: 300, activity_type: 'Relief' },
    { logged_at: new Date(Date.now() - 3600000).toISOString(), duration_sec: 180, activity_type: 'Focus' }
];

export async function upsertUser(userId: number): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
        await setUserContext(userId);
        await supabase.from('users').upsert({ id: userId }, { onConflict: 'id' });
    } catch (e) {
        console.warn('DB: upsertUser failed:', e);
    }
}

export async function saveBreathingSession(userId: number, session: BreathingSession) {
    if (!isSupabaseConfigured) return;
    try {
        await setUserContext(userId);
        const { error } = await supabase.from('breathing_sessions').insert({
            user_id: userId,
            ...session
        });
        if (error) throw error;
    } catch (e) {
        console.error('DB: saveBreathingSession failed:', e);
    }
}

export async function getBreathingSessions(userId: number): Promise<BreathingSession[]> {
    if (!isSupabaseConfigured) return MOCK_SESSIONS;
    try {
        await setUserContext(userId);
        const { data, error } = await supabase
            .from('breathing_sessions')
            .select('*')
            .eq('user_id', userId)
            .order('logged_at', { ascending: false });

        if (error) throw error;
        return data || MOCK_SESSIONS;
    } catch (e) {
        console.error('DB: getBreathingSessions failed:', e);
        return MOCK_SESSIONS;
    }
}