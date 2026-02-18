import { useEffect, useState, ReactNode } from 'react';
import { resolveUser } from '../lib/auth';
import { upsertUser } from '../lib/db';

export function AuthGate({ children }: { children: ReactNode }) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        console.log('AuthGate: resolving user...');
        resolveUser().then(async (id) => {
            console.log('AuthGate: resolved id:', id);
            if (id !== null) {
                try {
                    await upsertUser(id);
                    setReady(true);
                } catch (error) {
                    console.error('Failed to upsert user:', error);
                    setReady(true);
                }
            } else {
                console.warn('AuthGate: No user ID resolved. Redirecting or stuck.');
            }
        }).catch(err => {
            console.error('AuthGate: Error resolving user:', err);
        });
    }, []);

    if (!ready) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: '100svh', background: '#F5F7FA',
                fontFamily: "'Sora', sans-serif", fontSize: '15px', color: '#7A8FA6'
            }}>
                Verifying session...
            </div>
        );
    }

    return <>{children}</>;
}
