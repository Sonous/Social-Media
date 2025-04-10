import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { CircleChevronLeft, CircleChevronRight } from 'lucide-react';
import React, { memo } from 'react';
import Video from '../Video';

const MediasCarousel = ({ medias, className }: { medias: MediaType[]; className?: string }) => {
    const [api, setApi] = React.useState<CarouselApi>();
    // const [status, setStatus] = React.useState<'loading' | 'loaded'>('loading');

    // const [current, setCurrent] = React.useState(0);
    // const [count, setCount] = React.useState(0);

    // React.useEffect(() => {
    //     if (!api) {
    //         return;
    //     }

    //     setCount(api.scrollSnapList().length);
    //     setCurrent(api.selectedScrollSnap() + 1);

    //     api.on('select', () => {
    //         setCurrent(api.selectedScrollSnap() + 1);
    //     });
    // }, [api]);

    return (
        <Carousel setApi={setApi} className="h-full">
            <CarouselContent className="h-full">
                {medias?.map((media, index) => (
                    <CarouselItem key={index}>
                        {/* {status === 'loading' && <Skeleton className="w-full h-[200px] md:h-[400px] rounded-lg" />} */}
                        {media.type === 'image' ? (
                            <img
                                src={media.url}
                                className={`object-cover aspect-[4/3] ${className}`}
                                // onLoad={() => setStatus('loaded')}
                            />
                        ) : (
                            <Video
                                src={media.url}
                                className={`object-cover aspect-[4/3] ${className}`}
                                // onLoad={() => setStatus('loaded')}
                            />
                        )}
                    </CarouselItem>
                ))}
            </CarouselContent>

            {medias?.length > 1 && (
                <>
                    <div
                        className="absolute bottom-1/2 translate-y-1/2 left-5 cursor-pointer"
                        onClick={() => {
                            api?.scrollPrev();
                        }}
                    >
                        <CircleChevronLeft size={30} />
                    </div>
                    <div
                        className="absolute bottom-1/2 translate-y-1/2 right-5 cursor-pointer"
                        onClick={() => {
                            api?.scrollNext();
                        }}
                    >
                        <CircleChevronRight size={30} />
                    </div>
                </>
            )}
        </Carousel>
    );
};

export default memo(MediasCarousel);
