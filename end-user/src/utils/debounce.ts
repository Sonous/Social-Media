export function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
    let timmer: NodeJS.Timeout;

    return function (...args: Parameters<T>) {
        console.log(timmer);
        console.log(args);

        if (timmer) clearTimeout(timmer);
        timmer = setTimeout(() => {
            func(...args);
        }, delay);

        console.log(timmer);
    };
}
