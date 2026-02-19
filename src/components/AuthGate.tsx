import { useEffect, useState, ReactNode } from 'react';
import { resolveUser } from '../lib/auth';
import { upsertUser } from '../lib/db';

export function AuthGate({ children }: { children: ReactNode }) {
    const [ready, setReady] = useState(false);
    const [status, setStatus] = useState('Verifying session...');

    useEffect(() => {
        let isMounted = true;
        console.log('AuthGate: Starting verification flow...');

        const timeoutId = setTimeout(() => {
            if (isMounted && !ready) {
                console.warn('AuthGate: Safety timeout reached. Forcing ready state.');
                setReady(true);
            }
        }, 3000);

        const checkAuth = async () => {
            try {
                const userId = await resolveUser();
                if (!isMounted) return;
                
                if (userId) {
                    console.log('AuthGate: User verified:', userId);
                    setStatus('Syncing with database...');
                    await upsertUser(userId);
                } else {
                    console.log('AuthGate: Proceeding as unauthenticated guest');
                }
            } catch (err) {
                console.error('AuthGate: Error during auth flow:', err);
            } finally {
                if (isMounted) {
                    clearTimeout(timeoutId);
                    setReady(true);
                    console.log('AuthGate: Ready');
                }
            }
        };

        checkAuth();

        return () => { isMounted = false; clearTimeout(timeoutId); };
    }, []);

    if (!ready) {
        return (
            <div id="auth-loading-overlay" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: '100svh', background: '#F5F7FA',
                fontFamily: "'Sora', sans-serif", fontSize: '15px', color: '#7A8FA6'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: '12px' }}>{status}</div>
                    <div style={{ fontSize: '12px', opacity: 0.7 }}>Please wait a moment</div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}