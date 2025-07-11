import rawAxios from '@/configs/rawAxios.config';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';

export const AuthProtectedRoutes = () => {
    const [isPending, setIsPending] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        rawAxios
            .get('/auth/me')
            .then(({ data }) => {
                if (data) {
                    setIsAuth(true);
                } else {
                    setIsAuth(false);
                }
            })
            .catch(() => {
                console.error('Authentication failed');
            })
            .finally(() => setIsPending(false));
    }, []);

    return (
        <>
            {isPending ? (
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                </div>
            ) : isAuth ? (
                <Outlet />
            ) : (
                <Navigate to="/login" />
            )}
        </>
    );
};
