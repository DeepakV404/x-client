import { useEffect } from 'react';

const useEnterKeyHook = (callback: () => void) => {
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault(); 
                callback();
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [callback]);
};

export default useEnterKeyHook
