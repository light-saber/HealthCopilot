import { useState } from 'react';

export function useSessionStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading from sessionStorage:', error);
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        setStoredValue((currentValue) => {
            const valueToStore = value instanceof Function ? value(currentValue) : value;
            try {
                window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
            } catch (error) {
                console.error('Error writing to sessionStorage:', error);
            }
            return valueToStore;
        });
    };

    return [storedValue, setValue] as const;
}
