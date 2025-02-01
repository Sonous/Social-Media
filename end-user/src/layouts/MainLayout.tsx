import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { AlignJustify, Bell, Bookmark, House, Search, Send, Settings2, SquarePlus } from 'lucide-react';
import NavItem from '@/components/NavItem';
import React, { useEffect, useRef, useState } from 'react';
import { useAnimate } from 'motion/react';
import { useAppSelector } from '@/hooks/reduxHooks';
import { selectUser } from '@/store/slices/UserSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loading } from '@/components/Loading';
import CreateDialog from '@/components/create_post/CreateDialog';

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
    const [showMore, setShowMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const moreRef = useRef<HTMLButtonElement | null>(null);
    const [scope, animate] = useAnimate<HTMLDivElement>();
    const user = useAppSelector(selectUser);

    const location = useLocation();
    const navigate = useNavigate();

    // side effects
    useEffect(() => {
        if (showMore) {
            animate(scope.current, { display: 'flex', opacity: 1, transform: 'translateY(-10px)' });
        } else {
            animate(scope.current, { display: 'none', opacity: 0, transform: 'translateY(0px)' });
        }
    }, [showMore]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
                setShowMore(false);
            }
        };

        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('click', handleClickOutside);
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
    }, [isLoading, location]);

    function handleNavItem(navItem: NavItem) {
        if (navItem.link) {
            navigate(navItem.link);
        } else if (navItem.label) {
            switch (navItem.label) {
                case 'Create':
                    setShowCreateDialog(true);
                    break;
                default:
                    break;
            }
        }
    }

    // user
    useEffect(() => {
        setIsLoading(true);
        if (user.id) {
            setNavItems((prev) => {
                const isExist = navItems.some((item) => item.label === 'Profile');

                if (isExist) return prev;

                const newNavItems = [
                    ...prev,
                    {
                        iconElement: (
                            <Avatar>
                                <AvatarImage src={user.avatar_url} />
                                <AvatarFallback>{user.username}</AvatarFallback>
                            </Avatar>
                        ),
                        label: 'Profile',
                        link: `/${user.username}`,
                        isActive: false,
                    },
                ];

                if (newNavItems.length > 6) {
                    newNavItems.pop();
                }

                return newNavItems;
            });
            setIsLoading(false);
        }
    }, [user]);

    return (
        <>
            {!isLoading ? (
                <main className="grid sm:grid-cols-[1fr_10fr] lg:grid-cols-[1fr_5fr]">
                    <aside className="border-t-2 sm:h-svh sm:border-r-2 max-sm:absolute max-sm:bottom-0 w-full bg-white">
                        <div className="px-2 py-2 sm:py-5 flex h-full flex-col max-lg:items-center">
                            <div className="px-2 py-6 lg:px-3 lg:py-7 flex max-sm:hidden">
                                <Link to="/">
                                    <img src="/vite.svg" alt="logo" />
                                </Link>
                            </div>

                            <div className="flex-1 flex flex-col gap-5 max-sm:justify-evenly max-sm:w-full max-sm:flex-row overflow-auto">
                                {navItems.map((navItem, index) => (
                                    <NavItem
                                        key={index}
                                        iconElement={navItem.iconElement ?? <></>}
                                        label={navItem.label}
                                        isActive={navItem.isActive}
                                        onClick={() => handleNavItem(navItem)}
                                    />
                                ))}
                            </div>

                            <div className="relative max-sm:hidden">
                                <div
                                    ref={scope}
                                    className="flex-col gap-2 absolute bg-white w-[200px] rounded-md p-3 shadow-md -right-[220px] -top-[120px] lg:-right-10 lg:-top-[170px] hidden"
                                >
                                    <Link to="/">
                                        <NavItem iconElement={<Bookmark />} label="Bookmarks" applyMediaQuery={false} />
                                    </Link>
                                    <Link to="/">
                                        <NavItem iconElement={<Settings2 />} label="Settings" applyMediaQuery={false} />
                                    </Link>
                                    <div className="w-full h-[1px] bg-[#b6b6b6]"></div>
                                    <Link to="/">
                                        <NavItem label="Logout" applyMediaQuery={false} />
                                    </Link>
                                </div>

                                <button ref={moreRef} className="w-full" onClick={() => setShowMore(!showMore)}>
                                    <NavItem iconElement={<AlignJustify />} label="More" />
                                </button>
                            </div>
                        </div>
                    </aside>

                    <div className="overflow-y-auto h-svh">
                        <Outlet />
                        <div className='h-[100px]'></div>
                    </div>

                    {showCreateDialog && <CreateDialog setShowCreateDialog={setShowCreateDialog} />}
                </main>
            ) : (
                <Loading />
            )}
        </>
    );
}

export default MainLayout;
