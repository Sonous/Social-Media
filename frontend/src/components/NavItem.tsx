import classNames from 'classnames';
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useLocation } from 'react-router';

function NavItem({
    iconElement,
    label,
    isActive,
    applyMediaQuery = true,
    onClick = () => {},
    miniPopup = 'none',
}: {
    iconElement?: React.ReactElement;
    label: string;
    isActive?: boolean;
    applyMediaQuery?: boolean;
    onClick?: () => void;
    miniPopup?: MiniPopupState;
}) {
    const location = useLocation();

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div
                    className={classNames(
                        'w-full p-3 flex flex-row gap-3 max-lg:justify-center items-center hover:bg-[#0000000a] rounded-md cursor-pointer transition-all',
                        {
                            'border-2': isActive,
                            'lg:border-0 lg:pr-14': applyMediaQuery,
                            'justify-center !pr-3': miniPopup !== 'none' || location.pathname.includes('/inbox'),
                        },
                    )}
                    onClick={onClick}
                >
                    {iconElement}
                    <div
                        className={classNames('transition-all', {
                            'font-semibold': isActive,
                            'hidden lg:block': applyMediaQuery,
                            '!hidden ': miniPopup !== 'none' || location.pathname.includes('/inbox'),
                        })}
                    >
                        {label}
                    </div>
                </div>
            </TooltipTrigger>
            <TooltipContent className="bg-white p-2 rounded-md shadow-md" side="right">
                <p className="text-black">{label}</p>
            </TooltipContent>
        </Tooltip>
    );
}

export default NavItem;
