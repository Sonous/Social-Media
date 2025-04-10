import useTokenStore from '@/store/useTokenStore';
import { Navigate, Outlet } from 'react-router';

export const AuthProtectedRoutes = () => {
    const token = useTokenStore(state => state.token)

    return token ? <Outlet /> : <Navigate to="/login" />;
};
