import { useEffect, useState, ReactNode } from 'react';
import { resolveUser } from '../lib/auth';
import { upsertUser } from '../lib/db';

export function AuthGate({ children }: { children: ReactNode }) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let mounted = true;
        console.log('AuthGate: Starting verification for breath...');

        // 3-second safety timeout to prevent infinite blank screen
        const timer = setTimeout(() => {
            if (mounted && !ready) {
                console.warn('AuthGate: Verification timed out. Falling back to Guest mode.');
                setReady(true);
            }
        }, 3000);

        resolveUser().then(async (id) => {
            if (!mounted) return;
            console.log('AuthGate: Resolved ID:', id);
            
            if (id !== null) {
                try {
                    await upsertUser(id);
                } catch (error) {
                    console.error('AuthGate: DB error:', error);
                }
            }
            clearTimeout(timer);
            setReady(true);
        }).catch(err => {
            if (!mounted) return;
            console.error('AuthGate: Auth error:', err);
            clearTimeout(timer);
            setReady(true); // Fallback to allow app to load
        });

        return () => { mounted = false; clearTimeout(timer); };
    }, []);

    if (!ready) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: '100svh', background: '#F5F7FA',
                fontFamily: "'Sora', sans-serif", fontSize: '15px', color: '#7A8FA6'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: '10px' }}>Syncing session...</div>
                    <div style={{ fontSize: '12px', opacity: 0.6 }}>This won't take long</div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}