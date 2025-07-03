import CreateDialog from '@/components/create_post/CreateDialog';
import CustomAvatar from '@/components/CustomAvatar';
import NavItem from '@/components/NavItem';
import NotificationModal from '@/components/NotificationModal';
import SearchModal from '@/components/SearchModal';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useTokenStore from '@/store/useTokenStore';
import { AlignJustify, Bell, Bookmark, House, Search, Send, Settings2, SquarePlus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';

const initNavItem: NavItem[] = [
    {
        iconElement: <House />,
        label: 'Home',
        link: '/',
        isActive: true,
    },
    {
        iconElement: <Search />,
        label: 'Search',
        isActive: false,
    },
    {
        iconElement: <Send />,
        label: 'Message',
        link: '/inbox',
        isActive: false,
    },
    {
        iconElement: <Bell />,
        label: 'Notifications',
        isActive: false,
    },
    {
        iconElement: <SquarePlus />,
        label: 'Create',
        isActive: false,
    },
];

function MainLayout() {
    const [navItems, setNavItems] = useState(initNavItem);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const user = useTokenStore((state) => state.user);
    const { clearToken } = useTokenStore();
    const [miniPopup, setMiniPopup] = useState<MiniPopupState>('none');
    const asideRef = useRef<HTMLDivElement | null>(null);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleHideDialog = (event: MouseEvent) => {
            if (asideRef.current && !asideRef.current.contains(event.target as Node)) {
                setMiniPopup('none');
            }
        };

        const handleHide = (event: MouseEvent) => {
            handleHideDialog(event);
        };

        window.addEventListener('click', handleHide);

        return () => {
            window.removeEventListener('click', handleHide);
        };
    }, []);

    // handle active nav item
    useEffect(() => {
        const path = location.pathname.split('/')[1];

        setNavItems((prev) => {
            return prev.map((item) => {
                const link = item.link ? item.link.split('/')[1] : undefined;

                if (link === path) {
                    return {
                        ...item,
                        isActive: true,
                    };
                } else {
                    return {
                        ...item,
                        isActive: false,
                    };
                }
            });
        });
    }, [location]);

    function handleNavItem(navItem: NavItem) {
        if (navItem.link) {
            setMiniPopup('none');
            navigate(navItem.link);
        } else if (navItem.label) {
            switch (navItem.label) {
                case 'Create':
                    setShowCreateDialog(true);
                    break;
                case 'Search':
                    setMiniPopup((prev) => (prev === 'search' ? 'none' : 'search'));
                    break;
                case 'Notifications':
                    setMiniPopup((prev) => (prev === 'notification' ? 'none' : 'notification'));
                    break;
                default:
                    break;
            }
        }
    }

    return (
        <div className="relative">
            <main className="flex h-svh max-sm:flex-col">
                <div ref={asideRef} className="relative max-sm:order-2 sm:flex">
                    <aside className="border-t-2 sm:border-r-2 bg-white">
                        <div className="px-2 py-2 sm:py-5 flex h-full flex-col max-lg:items-center">
                            <div className="px-2 py-6 lg:px-3 lg:py-7 flex max-sm:hidden">
                                <Link to="/">
                                    <img src="/vite.svg" alt="logo" />
                                </Link>
                            </div>

                            <div className="flex-1 flex flex-col gap-3 max-sm:justify-evenly max-sm:w-full max-sm:flex-row overflow-auto">
                                {navItems.map((navItem, index) => (
                                    <NavItem
                                        key={index}
                                        iconElement={navItem.iconElement ?? <></>}
                                        label={navItem.label}
                                        isActive={navItem.isActive}
                                        onClick={() => handleNavItem(navItem)}
                                        miniPopup={miniPopup}
                                    />
                                ))}
                                {user && (
                                    <NavItem
                                        iconElement={
                                            <CustomAvatar avatar_url={user.avatar_url} username={user.username} />
                                        }
                                        label={'Profile'}
                                        isActive={location.pathname.includes(user.username)}
                                        onClick={() => {
                                            setMiniPopup('none');
                                            navigate(`/${user.username}`);
                                        }}
                                        miniPopup={miniPopup}
                                    />
                                )}
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <NavItem iconElement={<AlignJustify />} label="More" miniPopup={miniPopup} />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>
                                        <Link to="/">
                                            <Button variant={'ghost'}>
                                                <Bookmark />
                                                Bookmarks
                                            </Button>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link to="/accounts/edit">
                                            <Button variant={'ghost'}>
                                                <Settings2 />
                                                Settings
                                            </Button>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Button
                                            variant={'ghost'}
                                            onClick={() => {
                                                clearToken();
                                                navigate('/login', {
                                                    replace: true,
                                                });
                                            }}
                                        >
                                            Logout
                                        </Button>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </aside>
                    <div
                        className={`absolute sm:left-[100%] z-20 bg-white transition-all duration-300 sm:rounded-r-xl shadow-[4px_0_12px_-2px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden w-full h-full ${
                            miniPopup === 'none' ? 'sm:w-0 max-sm:h-0' : 'lg:w-[400px] sm:w-[300px]  max-sm:h-[400px]'
                        }`}
                    >
                        {miniPopup === 'search' && <SearchModal setMiniPopup={setMiniPopup} />}
                        {miniPopup === 'notification' && <NotificationModal />}
                    </div>
                </div>

                <div className="overflow-y-auto max-sm:flex-1 order-1 w-full">
                    <Outlet />
                </div>

                {showCreateDialog && <CreateDialog setShowCreateDialog={setShowCreateDialog} />}

            </main>
        </div>
    );
}

export default MainLayout;
