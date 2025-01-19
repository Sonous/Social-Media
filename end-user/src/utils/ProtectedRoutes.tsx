import { useAppSelector } from '@/hooks/reduxHooks';
import { selectUser } from '@/store/slices/UserSlice';
import { Navigate, Outlet } from 'react-router';

export const ProtectedRoutes = () => {
    const user = useAppSelector(selectUser);
    return user.id ? <Outlet /> : <Navigate to={'/login'} />;
};
