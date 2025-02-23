import React from 'react';
import classNames from 'classnames';

function NavItem({
    iconElement,
    label,
    isActive,
    applyMediaQuery = true,
    onClick,
}: {
    iconElement?: React.ReactElement;
    label: string;
    isActive?: boolean;
    applyMediaQuery?: boolean;
    onClick?: () => void;
}) {
    return (
        <div
            className={classNames(
                'w-full p-2 flex flex-row gap-3 max-lg:justify-center items-center hover:bg-[#0000000a] rounded-md cursor-pointer',
                {
                    'border-2': isActive,
                    'lg:p-3 lg:border-0': applyMediaQuery,
                },
            )}
            onClick={onClick}
        >
            {iconElement}
            <div
                className={classNames({
                    'font-semibold': isActive,
                    'hidden lg:block': applyMediaQuery,
                })}
            >
                {label}
            </div>
        </div>
    );
}

export default NavItem;
