import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import Main from './components/Main';

const App = () => {
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS >
            <Main />
        </MantineProvider >
    )
}

export default App;
