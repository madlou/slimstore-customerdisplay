import '@mantine/core/styles.css';
import { AppShell, Button, Container, Group, MantineProvider, NumberInput, Paper, Title, Text, Center, Stack, Flex, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Cookies from 'universal-cookie';
import { Client } from '@stomp/stompjs';
import Basket from './components/Basket';
import LanguageDropdown from './components/LanguageDropdown';
import './App.css'

const App = () => {
    const cookies = new Cookies();
    const socketDebug = false;
    const pollRegisters = true;
    const logApi = true;
    const [fontSize, setFontSize] = useState(24);
    const [basket, setBasket] = useState([]);
    const [tender, setTender] = useState([]);
    const [location, setLocation] = useState({ store: null, register: null });
    const [languages, setLanguages] = useState([]);
    const [language, setLanguage] = useState('EN');
    const [store, setStore] = useState(null);
    const [register, setRegister] = useState(null);
    const [translations, setTranslations] = useState(null);
    const [stompClient, setStompClient] = useState(null);
    const socket = new SockJS('/websocket');
    const socketConnect = () => {
        if (stompClient?.connected == true) {
            log('Socket', 'Already connnected!', true);
            return false;
        }
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (message) => {
                log('Socket Debug', message, socketDebug);
            },
            onConnect: () => {
                log('WebSocket Connect', location, true);
                if (pollRegisters) {
                    client.subscribe('/topic/connected', (response) => {
                        log('Register connected', JSON.parse(response.body), pollRegisters);
                    });
                    client.subscribe('/topic/disconnected', (response) => {
                        log('Register disconnected', JSON.parse(response.body), pollRegisters);
                    });
                }
                client.subscribe('/topic/' + location.store + '/' + location.register, (response) => {
                    const message = JSON.parse(response.body);
                    log('/topic/' + location.store + '/' + location.register, message);
                    if (message.tender) {
                        setTender(message.tender ?? []);
                    } else {
                        setBasket(message.basket ?? []);
                        setTender(message.tender ?? []);
                    }
                });
                client.publish({
                    destination: '/app/connect',
                    body: JSON.stringify(location),
                });
                setStompClient(client);
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
            onWebSocketClose: () => {
                setBasket([]);
                setTender([]);
                log('WebSocket Disconnected', location, true)
                if (cookies.get('store-register')) {
                    console.error('Unexpected disconnect, trying to reconnect.')
                    setTimeout(window.location.reload, 5000);
                }
            }
        });
        client.activate();
    }
    const socketDisconnect = () => {
        if (stompClient?.connected) {
            stompClient.publish({
                destination: '/app/disconnect',
                body: JSON.stringify(location),
            });
            setTimeout(() => {
                stompClient.deactivate();
                setStompClient(null);
            }, 100)
        }
    }
    const getData = async (setCallback, url) => {
        try {
            const apiCall = await fetch(url);
            const apiJson = await apiCall.json();
            log(url, apiJson);
            setCallback(apiJson);
        } catch {
            log(url, 'ERROR!!', true);
            setTimeout(changeRegister, 1000)
        }
    }
    const pad = (value, width, character = '0') => {
        value = value + '';
        return value.length >= width ? value : new Array(width - value.length + 1).join(character) + value;
    }
    const log = (key, value, override = null) => {
        if (override ?? logApi) {
            console.log(key, value);
        }
    }
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: location,
        validate: {
            store: (value) => (/^[0-9]{1,4}$/.test(value) ? null : 'Invalid store number'),
            register: (value) => (/^[0-9]{1,2}$/.test(value) ? null : 'Invalid register number'),
        }
    });
    const changeRegister = () => {
        cookies.remove('store-register');
        socketDisconnect();
        setStore(null);
        setRegister(null);
        setTimeout(() => {
            setLocation({ store: null, register: null })
        }, 300)
    }
    useEffect(() => {
        if (stompClient?.connected == true) {
            window.removeEventListener('beforeunload', socketDisconnect);
            window.addEventListener('beforeunload', socketDisconnect);
            getData(setStore, '/api/location/' + location.store);
            getData(setRegister, '/api/location/' + location.store + '/' + location.register);
            getData(setBasket, '/api/basket/' + location.store + '/' + location.register);
            getData(setTender, '/api/tender/' + location.store + '/' + location.register);
        }
    }, [stompClient])
    useEffect(() => {
        if (store) {
            setLanguage(store.languageCode);
        }
    }, [store])
    useEffect(() => {
        getData(setTranslations, '/api/ui/translations/' + language)
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
            socketConnect();
        }
    }, [location])
    useEffect(() => {
        document.documentElement.style.fontSize = fontSize + 'px';
    }, [fontSize]);
    useEffect(() => {
        if (cookies.get('store-register')) {
            const cookieSplit = cookies.get('store-register').split('-');
            setLocation({
                store: cookieSplit[0],
                register: cookieSplit[1],
            });
        }
        getData(setLanguages, '/api/languages');
    }, []);
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS >
            <AppShell
                header={{ height: 16 * 3 }}
                footer={{ height: 16 * 1.5 }}
            >
                <AppShell.Header>
                    <Container>
                        <Group
                            justify='space-between'>
                            <Title order={1} pt={4}>{translations ? translations.logo : ''}</Title>
                            <Title order={2} pt={6}>{store ? store.name : ''}</Title>
                            <LanguageDropdown
                                language={language}
                                languages={languages}
                                setLanguage={setLanguage}
                            />
                        </Group>
                    </Container>
                </AppShell.Header>
                <AppShell.Main
                    display={'flex'}
                    bg='rgba(0, 0, 0, .04)'
                >
                    <Container
                        flex={1}
                        display={'flex'}
                    >
                        <Paper
                            display={languages.length == 0 ? 'block' : 'none'}
                        >
                            <Text>Connecting to server...</Text>
                        </Paper>
                        <Center
                            display={stompClient != null && basket.length == 0 ? 'flex' : 'none'}
                            flex={1}
                        >
                            <Box className='rainbow'>
                                <Title order={1} flex={1} ta={'center'}>Welcome to XJT!</Title>
                            </Box>

                        </Center>
                        <Paper
                            flex={1}
                            display={stompClient == null && languages.length > 0 ? 'block' : 'none'}
                            m={16}
                            p={32}
                        >
                            <form onSubmit={form.onSubmit((values) => setLocation(values))}>
                                <NumberInput
                                    key={form.key('store')}
                                    label='Store Number'
                                    mt={16}
                                    {...form.getInputProps('store')}
                                />
                                <NumberInput
                                    key={form.key('register')}
                                    label='Register Number'
                                    mt={16}
                                    {...form.getInputProps('register')}
                                />
                                <Button
                                    mt={16}
                                    type={'submit'}
                                >Connect</Button>
                            </form>
                        </Paper>
                        <Paper
                            flex={1}
                            p={32}
                            m={16}
                            display={basket.length > 0 ? 'block' : 'none'}
                        >
                            <Basket
                                basket={basket}
                                tender={tender}
                                store={store}
                                translations={translations}
                            />
                        </Paper>
                    </Container>

                </AppShell.Main>
                <AppShell.Footer
                    bg='rgba(0, 0, 0, .04)'
                >
                    {store && register ? (
                        <Container>
                            <Group
                                onClick={changeRegister}
                                justify='center'
                            >
                                <Title
                                    order={4}
                                    c={'grey'}>
                                    {pad(store.number, 4) + '-' + pad(register.number, 2)}
                                </Title>
                            </Group>
                        </Container>
                    ) : ''}
                </AppShell.Footer>
            </AppShell >
        </MantineProvider>
    )
}

export default App;
