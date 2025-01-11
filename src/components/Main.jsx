import { useContext } from 'react';
import { AppShell, Container } from '@mantine/core';
import { ResponsiveContext } from '../context/ResponsiveProvider';
import Basket from './Basket';
import Connecting from './Connecting';
import Form from './Form';
import Footer from './Footer';
import Header from './Header';
import Welcome from './Welcome';
import '@mantine/core/styles.css';

const Main = () => {
    const { width } = useContext(ResponsiveContext);
    return (
        <AppShell
            header={{ height: 16 * 3 }}
            footer={{ height: 16 * 1.5 }}
        >
            <AppShell.Header>
                <Header />
            </AppShell.Header>
            <AppShell.Main
                display={'flex'}
                bg='rgba(0, 0, 0, .04)'
            >
                <Container
                    maw={800}
                    display={'flex'}
                    flex={1}
                    style={{ paddingInline: width < 992 ? 0 : 'var(--mantine-spacing-md)' }}
                >
                    <Connecting />
                    <Form />
                    <Welcome />
                    <Basket />
                </Container>
            </AppShell.Main>
            <AppShell.Footer
                bg='rgba(0, 0, 0, .04)'
            >
                <Footer />
            </AppShell.Footer>
        </AppShell >
    )
}

export default Main;
