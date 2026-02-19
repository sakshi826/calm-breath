import { useEffect, useState, ReactNode } from 'react';
import { resolveUser } from '../lib/auth';
import { upsertUser } from '../lib/db';

export function AuthGate({ children }: { children: ReactNode }) {
    const [ready, setReady] = useState(false);
    const [status, setStatus] = useState('Verifying session...');

    useEffect(() => {
        let isMounted = true;
        console.log('AuthGate: Initializing...');

        // 3-second safety timeout: If auth takes too long, proceed as guest
        const timeoutId = setTimeout(() => {
            if (isMounted && !ready) {
                console.warn('AuthGate: Auth check timed out. Proceeding in Guest Mode.');
                setReady(true);
            }
        }, 3000);

        resolveUser()
            .then(async (userId) => {
                if (!isMounted) return;
                
                if (userId) {
                    try {
                        setStatus('Syncing data...');
                        await upsertUser(userId);
                    } catch (err) {
                        console.error('AuthGate: Failed to upsert user, proceeding anyway:', err);
                    }
                } else {
                    console.log('AuthGate: No user found, proceeding as guest.');
                }
                
                clearTimeout(timeoutId);
                setReady(true);
            })
            .catch((err) => {
                if (!isMounted) return;
                console.error('AuthGate: Error resolving user:', err);
                clearTimeout(timeoutId);
                setReady(true); // Always proceed to avoid blank screen
            });

        return () => { isMounted = false; clearTimeout(timeoutId); };
    }, []);

    if (!ready) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: '100svh', background: '#F5F7FA',
                fontFamily: "'Sora', sans-serif", fontSize: '15px', color: '#7A8FA6'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: '12px' }}>{status}</div>
                    <div style={{ fontSize: '12px', opacity: 0.7 }}>Almost there</div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}