import useLocalStorage from '@/hooks/useLocalStorage';
import { Navigate, Outlet } from 'react-router';

export const UnauthorProtectRoute = () => {
    const { getItem } = useLocalStorage('auth_info');
    const isLogged = getItem('isLogged');

    return !isLogged ? <Outlet /> : <Navigate to="/" />;
};
