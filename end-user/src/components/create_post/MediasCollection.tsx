import { nanoid } from '@reduxjs/toolkit';
import { CirclePlus } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SlotItemMapArray, Swapy, utils, createSwapy } from 'swapy';

const MediasCollection = ({ medias, setMedias }: MediaState) => {
    const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>(utils.initSlotItemMap(medias, 'fileId'));
    const slottedItems = useMemo(() => utils.toSlottedItems(medias, 'fileId', slotItemMap), [medias, slotItemMap]);

    const swapyRef = useRef<Swapy | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => utils.dynamicSwapy(swapyRef.current, medias, 'fileId', slotItemMap, setSlotItemMap), [medias]);

    useEffect(() => {
        swapyRef.current = createSwapy(containerRef.current!, {
            manualSwap: true,
            animation: 'dynamic',
            swapMode: 'hover',
            autoScrollOnDrag: true,
            dragAxis: 'x',
        });

        swapyRef.current.onSwap((event) => {
            setSlotItemMap(event.newSlotItemMap.asArray);
        });

        swapyRef.current.onSwapEnd((event) => {
            if (event.hasChanged) {
                setMedias((prev) => {
                    const newMedias = prev.map((_, index) => {
                        return prev.find((item) => item.fileId === event.slotItemMap.asArray[index].item);
                    }).filter((item): item is CustomFile => item !== undefined);

                    if (newMedias.length > 0) return newMedias;
                    else return prev;
                });
            }
        });

        return () => {
            swapyRef.current?.destroy();
        };
    }, []);

    // file input
    const fileRef = useRef<HTMLInputElement>(null);
    function handleSelectMedias(event: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(event.target.files!).map(file => ({
            file,
            fileId: nanoid()
        }));

        // console.log(files)

        setMedias((prev) => [...prev, ...files]);
        event.target.value = ''
    }

    return (
        <div ref={containerRef} className="flex gap-3 items-center p-3 ">
            <div className="flex gap-3 overflow-auto">
                {slottedItems.map(({ slotId, itemId, item }) => (
                    <div key={slotId} data-swapy-slot={slotId} className='shrink-0'>
                        {item && (
                            <div data-swapy-item={itemId} key={itemId}>
                                <img
                                    src={URL.createObjectURL(item.file)}
                                    alt={item.file.name}
                                    className="object-cover w-20 h-20 rounded-xl"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div
                onClick={() => {
                    fileRef.current?.click();
                }}
            >
                <CirclePlus size={30} />
            </div>

            <input
                ref={fileRef}
                onChange={handleSelectMedias}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
            />
        </div>
    );
};

export default MediasCollection;
