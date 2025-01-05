import Cookies from 'universal-cookie';
import React, { useState, useEffect } from 'react';
import { AppShell, Container, MantineProvider } from '@mantine/core';
import { createApi } from './util/createApi';
import { createLogger } from './util/createLogger';
import { createSocket } from './util/createSocket';
import Basket from './components/Basket';
import Connecting from './components/Connecting';
import Form from './components/Form';
import Footer from './components/Footer';
import Header from './components/Header';
import Welcome from './components/Welcome';
import '@mantine/core/styles.css';
import './App.css'

const App = () => {
    const cookies = new Cookies();
    const [fontSize, setFontSize] = useState(24);
    const [basket, setBasket] = useState([]);
    const [tender, setTender] = useState([]);
    const [location, setLocation] = useState({ store: null, register: null });
    const [languages, setLanguages] = useState([]);
    const [language, setLanguage] = useState('EN');
    const [store, setStore] = useState(null);
    const [register, setRegister] = useState(null);
    const [translations, setTranslations] = useState(null);
    const [connected, setConnected] = useState(false);
    const [showThankyou, setShowThankyou] = useState(false);
    const logger = createLogger({
        level: import.meta.env.VITE_LOG_TO_CONSOLE,
    })
    const socket = createSocket({
        url: '/websocket',
        logger: logger,
        onConnect: () => {
            api.get(setStore, '/location/' + location.store);
            api.get(setRegister, '/location/' + location.store + '/' + location.register);
            api.get(setBasket, '/basket/' + location.store + '/' + location.register);
            api.get(setTender, '/tender/' + location.store + '/' + location.register);
            setConnected(true);
        },
        onDisconnect: () => {
            setBasket([]);
            setTender([]);
            setConnected(false);
        },
        onMessage: (message) => {
            if (message.tender) {
                setTender(message.tender ?? []);
                if (message.tender.length === 0) {
                    console.log('triggered show thank you')
                    setShowThankyou(true);
                    setTimeout(() => {
                        setShowThankyou(false);
                    }, 5000);
                }
            } else {
                setBasket(message.basket ?? []);
                setTender(message.tender ?? []);
            }
        },
    });
    const api = createApi({
        url: '/api',
        logger: logger,
        onError: socket.disconnect
    });
    useEffect(() => {
        if (store) {
            setLanguage(store.languageCode);
        }
    }, [store])
    useEffect(() => {
        api.get(setTranslations, '/ui/translations/' + language)
    }, [language])
    useEffect(() => {
        if (location.store && location.register) {
            cookies.set(
                'store-register',
                location.store + '-' + location.register,
                {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 365,
                    sameSite: 'Strict',
                },
            );
            socket.connect(location);
        }
    }, [location])
    useEffect(() => {
        document.documentElement.style.fontSize = fontSize + 'px';
    }, [fontSize]);
    useEffect(() => {
        if (cookies.get('store-register')) {
            const cookieSplit = cookies.get('store-register').split('-');
            setLocation({
                store: cookieSplit[0] * 1,
                register: cookieSplit[1] * 1,
            });
        }
        api.get(setLanguages, '/languages');
    }, []);
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS >
            <AppShell
                header={{ height: 16 * 3 }}
                footer={{ height: 16 * 1.5 }}
            >
                <AppShell.Header>
                    {language && languages && translations ? (
                        <Header
                            languages={languages}
                            language={language}
                            setLanguage={setLanguage}
                            store={store}
                            translations={translations}
                        />
                    ) : ''}
                </AppShell.Header>
                <AppShell.Main
                    display={'flex'}
                    bg='rgba(0, 0, 0, .04)'
                >
                    <Container
                        w={'100%'}
                        maw={800}
                        display={'flex'}
                        flex={1}
                    >
                        {translations && languages.length == 0 ? (
                            <Connecting
                                translations={translations}
                            />
                        ) : ''}
                        {translations && connected && basket.length == 0 ? (
                            <Welcome
                                translations={translations}
                                showThankyou={showThankyou}
                            />
                        ) : ''}
                        {translations && !connected && languages.length > 0 ? (
                            <Form
                                location={location}
                                setLocation={setLocation}
                                translations={translations}
                            />
                        ) : ''}
                        {translations && basket.length > 0 ? (
                            <Basket
                                basket={basket}
                                tender={tender}
                                store={store}
                                translations={translations}
                            />
                        ) : ''}
                    </Container>
                </AppShell.Main>
                <AppShell.Footer
                    bg='rgba(0, 0, 0, .04)'
                >
                    {store && register && socket ? (
                        <Footer
                            store={store}
                            register={register}
                            socket={socket}
                        />
                    ) : ''}
                </AppShell.Footer>
            </AppShell >
        </MantineProvider >
    )
}

export default App;
