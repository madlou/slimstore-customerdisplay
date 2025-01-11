import { MantineProvider } from '@mantine/core';
import { LocationProvider } from './context/LocationProvider';
import { ResponsiveProvider } from './context/ResponsiveProvider';
import { SocketProvider } from './context/SocketProvider';
import { TranslationProvider } from './context/TranslationProvider';
import Main from './components/Main';
import '@mantine/core/styles.css';

const App = () => {
    return (
        <ResponsiveProvider>
            <TranslationProvider>
                <LocationProvider>
                    <SocketProvider>
                        <MantineProvider withGlobalStyles withNormalizeCSS >
                            <Main />
                        </MantineProvider >
                    </SocketProvider>
                </LocationProvider>
            </TranslationProvider>
        </ResponsiveProvider>
    )
}

export default App;
