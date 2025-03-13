import { MantineProvider } from '@mantine/core';
import { LocationProvider } from './providers/LocationProvider';
import { ResponsiveProvider } from './providers/ResponsiveProvider';
import { DisplayProvider } from './providers/DisplayProvider';
import { TranslationProvider } from './providers/TranslationProvider';
import Main from './components/Main';
import '@mantine/core/styles.css';

const App = () => {
    return (
        <ResponsiveProvider>
            <TranslationProvider>
                <LocationProvider>
                    <DisplayProvider>
                        <MantineProvider withGlobalStyles withNormalizeCSS >
                            <Main />
                        </MantineProvider >
                    </DisplayProvider>
                </LocationProvider>
            </TranslationProvider>
        </ResponsiveProvider>
    )
}

export default App;
