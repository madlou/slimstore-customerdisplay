import { MantineProvider } from '@mantine/core';
import { LocationProvider } from './providers/LocationProvider';
import { ResponsiveProvider } from './providers/ResponsiveProvider';
import { SocketProvider } from './providers/SocketProvider';
import { TranslationProvider } from './providers/TranslationProvider';
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
