function useLocalStorage(key: string) {
    const storage = JSON.parse(localStorage.getItem(key) || '{}');

    function save() {
        localStorage.setItem(key, JSON.stringify(storage));
    }

    return {
        getItem(key: string) {
            return storage[key];
        },
        setItem<T>(key: string, value: T) {
            storage[key] = value;
            save();
        },
        deleteItem(key: string) {
            delete storage[key];
            save();
        },
        dropStorage() {
            localStorage.removeItem(key);
        }
    };
}

export default useLocalStorage;
