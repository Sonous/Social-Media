import React from "react";
import classNames from "classnames";

function NavItem({
  iconElement,
  label,
  isActive,
  applyMediaQuery = true,
}: {
  iconElement?: React.ReactElement;
  label: string;
  isActive?: boolean;
  applyMediaQuery?: boolean;
}) {
  return (
    <div
      className={classNames(
        "w-full p-2 flex flex-row gap-3 items-center hover:bg-[#0000000a] rounded-md",
        {
          "border-2": isActive,
          "lg:p-3 lg:border-0": applyMediaQuery,
        }
      )}
    >
      {iconElement}
      <div
        className={classNames({
          "font-semibold": isActive,
          "hidden lg:block": applyMediaQuery,
        })}
      >
        {label}
      </div>
    </div>
  );
}

export default NavItem;
