import { CircleX, Loader, SearchIcon } from 'lucide-react';
import React, { useState } from 'react';

const Search = ({
    value,
    setValue,
    isLoading,
}: {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
}) => {
    const [isForcus, setIsForcus] = useState(true);

    return (
        <div className="flex items-center px-3 py-2 bg-[#ededed] rounded-lg">
            {isForcus && <SearchIcon size={20} />}
            <input
                className="outline-none bg-[#ededed] w-full text-sm"
                onFocus={() => setIsForcus(false)}
                onBlur={() => {
                    if (!value) {
                        setIsForcus(true);
                    }
                }}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />

            {value &&
                (isLoading ? (
                    <Loader className="animate-spin" size={18} fill="black" color="white" />
                ) : (
                    <CircleX
                        className="cursor-pointer"
                        size={18}
                        fill="black"
                        color="white"
                        onClick={() => setValue('')}
                    />
                ))}
        </div>
    );
};

export default Search;
