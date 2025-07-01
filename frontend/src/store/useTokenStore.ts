import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer'

interface TokenState {
    token: string;
    user: User | null;
    setToken: (token: string) => void;
    clearToken: () => void;
    updateUser: (updatedInfo: Partial<Pick<User, "avatar_url" | "bio">>) => void;
}

const useTokenStore = create<TokenState>()(
    devtools(
        persist(
            immer((set) => ({
                token: '',
                user: null,
                setToken(token: string) {
                    const payload = getTokenPayload<TokenPayload>(token);
                    if(!payload) {
                        console.error('Invalid token payload');
                        return;
                    }

                    set({ token, user: payload.user });
                },
                clearToken() {
                    set({ token: '', user: null });
                },
                updateUser(updatedInfo) {
                    set((state) => {
                        if(!state.user) return;

                        Object.assign(state.user, updatedInfo);
                    });
                }
            })),
            {
                name: 'accessToken',
            }
        )
    )
);

export default useTokenStore;

export const getTokenPayload = <T>(token: string): T | null => {
    try {
        if (!token) return null;
        
        // JWT token consists of three parts: header.payload.signature
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        
        // Decode the payload (middle part)
        const base64Payload = parts[1];
        const payload = JSON.parse(atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/')));
        
        return payload as T;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}