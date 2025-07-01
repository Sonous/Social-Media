import NavItem from '@/components/NavItem';
import { CircleUserRound } from 'lucide-react';
import { Outlet, useLocation } from 'react-router';

const AccountLayout = () => {
    const { pathname } = useLocation();

    return (
        <div className="flex h-svh">
            <div className="border-r-2 overflow-auto p-5 space-y-5">
                <h1 className="text-xl font-bold">Settings</h1>
                <div>
                    <NavItem
                        label="Edit Profile"
                        iconElement={<CircleUserRound />}
                        isActive={pathname === '/accounts/edit'}
                    />
                </div>
            </div>
            
            <Outlet />
        </div>
    );
};

export default AccountLayout;
