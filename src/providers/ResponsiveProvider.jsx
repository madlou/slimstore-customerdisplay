import { createContext, useState, useEffect } from "react";
import { useViewportSize } from '@mantine/hooks';

// eslint-disable-next-line react-refresh/only-export-components
export const ResponsiveContext = createContext();

// eslint-disable-next-line react/prop-types
export const ResponsiveProvider = ({ children }) => {
    const { width } = useViewportSize();
    const [fontSize, setFontSize] = useState(24);
    const [isMobile, setIsMobile] = useState(false);
    const breakpoint = {
        xs: 576,
        sm: 768,
        md: 992,
        lg: 1200,
        xl: 1408,
    }
    const scrollHeight = isMobile ?
        'calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - 60px)' :
        'calc(100vh - var(--app-shell-header-height, 0px) - var(--app-shell-footer-height, 0px) - 150px)';
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
        setIsMobile(width < breakpoint.md)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width]);
    useEffect(() => {
        document.documentElement.style.fontSize = fontSize + 'px';
    }, [fontSize]);
    return (
        <ResponsiveContext.Provider
            value={{
                fontSize, setFontSize,
                scrollHeight,
                isMobile,
            }}
        >
            {children}
        </ResponsiveContext.Provider>
    );
};
