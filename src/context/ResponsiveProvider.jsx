import { createContext, useState, useEffect } from "react";
import { useViewportSize } from '@mantine/hooks';

export const ResponsiveContext = createContext();

export const ResponsiveProvider = ({ children }) => {
    const { width } = useViewportSize();
    const [fontSize, setFontSize] = useState(24);
    const breakpoint = {
        xs: 576,
        sm: 768,
        md: 992,
        lg: 1200,
        xl: 1408,
    }
    useEffect(() => {
        if (width < breakpoint.xs) {
            setFontSize(16);
        } else if (width < breakpoint.sm) {
            setFontSize(18)
        } else if (width < breakpoint.md) {
            setFontSize(20)
        } else if (width < breakpoint.lg) {
            setFontSize(22)
        } else if (width < breakpoint.xl) {
            setFontSize(24)
        } else {
            setFontSize(26)
        }
    }, [width]);
    useEffect(() => {
        document.documentElement.style.fontSize = fontSize + 'px';
    }, [fontSize]);
    return (
        <ResponsiveContext.Provider
            value={{ fontSize, setFontSize, width }}
        >
            {children}
        </ResponsiveContext.Provider>
    );
};
