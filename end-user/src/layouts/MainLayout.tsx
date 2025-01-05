import { Link, Outlet } from 'react-router';
import { AlignJustify, Bell, Bookmark, House, Search, Send, Settings2 } from 'lucide-react';
import NavItem from '@/components/NavItem';
import React, { useEffect, useRef, useState } from 'react';
import { useAnimate } from 'motion/react';

const initNavItem = [
    {
        iconElement: <House />,
        label: 'Home',
        link: '/',
        isActive: true,
    },
    {
        iconElement: <Search />,
        label: 'Search',
        link: '/',
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
        link: '/',
        isActive: false,
    },
];

function MainLayout() {
    const [navItems, setNavItems] = useState(initNavItem);
    const [showMore, setShowMore] = useState(false);
    const moreRef = useRef<HTMLButtonElement | null>(null);
    const [scope, animate] = useAnimate<HTMLDivElement>();

    // side effects
    useEffect(() => {
        if (showMore) {
            animate(scope.current, { opacity: 1, transform: 'translateY(-10px)' });
        } else {
            animate(scope.current, { opacity: 0, transform: 'translateY(0px)' });
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

    // handle function
    const handleActiveTag = (label: string) => {
        setNavItems((prev) => {
            return prev.map((navItem) => {
                if (navItem.label === label) {
                    return { ...navItem, isActive: true };
                } else {
                    return { ...navItem, isActive: false };
                }
            });
        });
    };

    return (
        <>
            <main className="grid grid-cols-9 lg:grid-cols-13">
                <aside className="col-span-1 lg:col-span-2 h-svh border-r-2">
                    <div className="px-2 py-5 flex flex-col h-full max-lg:items-center">
                        <div className="px-2 py-6 lg:px-3 lg:py-7 flex">
                            <Link to="/">
                                <img src="/vite.svg" alt="logo" />
                            </Link>
                        </div>

                        <div className="flex-1 flex flex-col gap-2">
                            {navItems.map((navItem, index) => (
                                <Link to={navItem.link} key={index} onClick={() => handleActiveTag(navItem.label)}>
                                    <NavItem
                                        iconElement={navItem.iconElement}
                                        label={navItem.label}
                                        isActive={navItem.isActive}
                                    />
                                </Link>
                            ))}
                        </div>

                        <div className="relative ">
                            <div
                                ref={scope}
                                className="flex flex-col gap-2 absolute bg-white w-[200px] rounded-md p-3 shadow-md -right-[220px] -top-[120px] lg:-right-10 lg:-top-[170px] opacity-0"
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

                <Outlet />
            </main>
        </>
    );
}

export default MainLayout;
