import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as _useColorScheme } from 'react-native';

const ThemeContext = createContext({
    colorScheme: 'light',
    isDark: false,
    toggleTheme: () => {},
    setTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
    const systemColorScheme = _useColorScheme();
    const [colorScheme, setColorScheme] = useState(systemColorScheme || 'light');

    useEffect(() => {
        if (systemColorScheme) {
            setColorScheme(systemColorScheme);
        }
    }, [systemColorScheme]);

    const toggleTheme = () => {
        setColorScheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const value = {
        colorScheme,
        isDark: colorScheme === 'dark',
        toggleTheme,
        setTheme: setColorScheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
