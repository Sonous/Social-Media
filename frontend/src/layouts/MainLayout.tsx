import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { AlignJustify, Bell, Bookmark, House, Search, Send, Settings2, SquarePlus } from 'lucide-react';
import NavItem from '@/components/NavItem';
import { useContext, useEffect, useRef, useState } from 'react';
import { useAnimate } from 'motion/react';
import CreateDialog from '@/components/create_post/CreateDialog';
import { PostModalContext } from '@/context/PostModalProvider';
import Post from '@/components/Post';
import CustomAvatar from '@/components/CustomAvatar';
import SearchModal from '@/components/SearchModal';
import NotificationModal from '@/components/NotificationModal';
import useTokenStore from '@/store/useTokenStore';

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
    // const [isLoading, setIsLoading] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const moreRef = useRef<HTMLButtonElement | null>(null);
    const [scope, animate] = useAnimate<HTMLDivElement>();
    const user = useTokenStore((state) => state.user);
    const { clearToken } = useTokenStore();
    const { isOpenPostModal, post } = useContext(PostModalContext);
    // const [showSearchModal, setShowSearchModal] = useState(false);
    // const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [miniPopup, setMiniPopup] = useState<MiniPopupState>('none');
    const asideRef = useRef<HTMLDivElement | null>(null);

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

        const handleHideDialog = (event: MouseEvent) => {
            if (asideRef.current && !asideRef.current.contains(event.target as Node)) {
                setMiniPopup('none');
            }
        };

        const handleHide = (event: MouseEvent) => {
            handleClickOutside(event);
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

                            {/* TODO: Sử dụng shadcn component menu cho cái này */}
                            <div className="relative max-sm:hidden">
                                <div
                                    ref={scope}
                                    className="flex-col gap-2 absolute z-50 bg-white w-[200px] rounded-md p-3 shadow-md -right-[220px] -top-[120px] lg:-right-10 lg:-top-[170px] hidden"
                                >
                                    <Link to="/">
                                        <NavItem iconElement={<Bookmark />} label="Bookmarks" applyMediaQuery={false} />
                                    </Link>
                                    <Link to="/accounts/edit">
                                        <NavItem iconElement={<Settings2 />} label="Settings" applyMediaQuery={false} />
                                    </Link>
                                    <div className="w-full h-[1px] bg-[#b6b6b6]"></div>
                                    <button
                                        onClick={() => {
                                            clearToken();
                                            navigate('/login');
                                        }}
                                    >
                                        <NavItem label="Logout" applyMediaQuery={false} />
                                    </button>
                                </div>

                                <button ref={moreRef} className="w-full" onClick={() => setShowMore(!showMore)}>
                                    <NavItem iconElement={<AlignJustify />} label="More" />
                                </button>
                            </div>
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

                {isOpenPostModal && <Post type="modal" post={post as Post} />}
            </main>
        </div>
    );
}

export default MainLayout;
