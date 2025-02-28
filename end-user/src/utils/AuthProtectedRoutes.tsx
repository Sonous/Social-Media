import userApis from '@/apis/users.api';
import { Loading } from '@/components/Loading';
import { useAppDispatch } from '@/hooks/reduxHooks';
import useLocalStorage from '@/hooks/useLocalStorage';
import { setUser } from '@/store/slices/UserSlice';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';

export const ProtectedRoutes = () => {
    const { getItem, dropStorage } = useLocalStorage('auth_info');
    const [isLogged, setIsLogged] = useState(getItem('isLogged'));
    const dispatch = useAppDispatch();
    const { data, isError, isLoading, isFetching, error } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const access_token = getItem('access_token');
            // console.log('fjaisdji', access_token)
            return await userApis.getUserByToken(access_token);
        },
    });

    // console.log(isFetching)

    useEffect(() => {
        if (!isError && !isFetching && data) {
            // console.log(data)

            dispatch(setUser(data));
            setIsLogged(true);
        } else if (isError) {
            if (error instanceof AxiosError) {
                if (error.status === 401) {
                    dropStorage();
                    setIsLogged(false);
                }
                console.log(error);
            }
            
        }
    }, [isError, isFetching, data]);

    return isLogged ? (
        <>
            {isLoading ? <Loading /> : <Outlet />}
            
        </>
    ) : (
        <Navigate to="/login" />
    );
};
