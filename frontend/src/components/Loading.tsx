import classNames from 'classnames';
import { LoaderCircle } from 'lucide-react';

type LoadingProps = {
    className: string;
    size: number;
    state: 'nomal' | 'full';
};

export const Loading = ({ className, size, state }: Partial<LoadingProps>) => {
    // const [dotsState, setDotsState] = useState<string[]>([]);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setDotsState((prev) => (prev.length > 4 ? [] : [...prev, '.']));
    //     }, 500);

    //     return () => {
    //         clearInterval(interval);
    //     }
    // }, [dotsState]);

    return (
        // <DotLottieReact
        //     src="https://lottie.host/cac7b023-a099-4bea-b27a-e0787299433c/wKsvR7p1j8.lottie"
        //     loop
        //     autoplay
        // />
        <div
            className={classNames(`flex-center w-full h-full ${className}`, {
                'absolute z-[100] top-0 left-0': state === 'full',
            })}
        >
            <div
                className={classNames('flex-center flex-col gap-2', {
                    'p-5 bg-white rounded-lg shadow-lg': state === 'full',
                })}
            >
                <LoaderCircle className="animate-spin" size={size} />
                {/* <p>Loading{dotsState.join('')}</p> */}
                <p>Loading...</p>
            </div>
        </div>
    );
};
