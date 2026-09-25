import { useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { useLogger } from './useLogger';
import Cookies from 'universal-cookie';

export function useSocket({ url, onConnect, onDisconnect, onMessage }) {
    const stompClient = useRef(null);
    const location = useRef(null);
    const connectedState = useRef(null);
    const beforeUnloadHandler = useRef(null);
    const closingClients = useRef(new WeakSet());
    const cookies = new Cookies();
    if (typeof url !== 'string') {
        throw Error('Expected url to be a string. Received: ' + url);
    }
    const logger = useLogger({
        level: import.meta.env.VITE_LOG_TO_CONSOLE,
    })
    const brokerUrl = () => {
        const brokerUrl = new URL(url, window.location.href);
        brokerUrl.protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        return brokerUrl.href;
    };
    const disconnect = () => {
        connectedState.current = false;
        const client = stompClient.current;
        if (!client) {
            return;
        }
        closingClients.current.add(client);
        if (beforeUnloadHandler.current) {
            window.removeEventListener('beforeunload', beforeUnloadHandler.current);
            beforeUnloadHandler.current = null;
        }
        if (client.connected) {
            client.publish({
                destination: '/app/disconnect',
                body: JSON.stringify(location.current),
            });
        }
        setTimeout(() => {
            client.deactivate();
            if (stompClient.current === client) {
                stompClient.current = null;
            }
        }, 100)
    };
    return {
        connect: (locationObject) => {
            connectedState.current = true;
            if (stompClient.current) {
                logger && logger.info('Socket', 'Already connected or connecting!', true);
                return false;
            }
            const client = new Client({
                brokerURL: brokerUrl(),
                heartbeatIncoming: 0,
                heartbeatOutgoing: 20000,
                reconnectDelay: 5000,
                debug: (message) => {
                    logger && logger.debug('Socket Debug', message);
                },
                onConnect: () => {
                    const subscriptionHeaders = {
                        token: cookies.get('token') ?? '',
                    };
                    logger && logger.info('WebSocket Connect', locationObject, true);
                    client.subscribe('/topic/connected', (response) => {
                        logger && logger.debug('Register Connected', JSON.parse(response.body));
                    });
                    client.subscribe('/topic/disconnected', (response) => {
                        logger && logger.debug('Register Disconnected', JSON.parse(response.body));
                    });
                    client.subscribe('/topic/' + locationObject.store + '/' + locationObject.register, (response) => {
                        const message = JSON.parse(response.body);
                        logger && logger.info('/topic/' + locationObject.store + '/' + locationObject.register, message);
                        onMessage && onMessage(message);
                    }, subscriptionHeaders);
                    client.publish({
                        destination: '/app/connect',
                        body: JSON.stringify(locationObject),
                    });
                    location.current = locationObject;
                    if (beforeUnloadHandler.current) {
                        window.removeEventListener('beforeunload', beforeUnloadHandler.current);
                    }
                    beforeUnloadHandler.current = disconnect;
                    window.addEventListener('beforeunload', beforeUnloadHandler.current);
                    onConnect && onConnect();
                },
                onStompError: (frame) => {
                    console.error('Broker reported error: ' + frame.headers['message']);
                    console.error('Additional details: ' + frame.body);
                },
                onWebSocketClose: (event) => {
                    const isCurrentClient = stompClient.current === client;
                    const expectedClose = closingClients.current.has(client) || !isCurrentClient;
                    logger && logger.info('WebSocket Disconnected', location.current, true)
                    if (expectedClose) {
                        if (isCurrentClient) {
                            stompClient.current = null;
                            onDisconnect && onDisconnect();
                        }
                        return;
                    }
                    if (connectedState.current) {
                        console.error('Unexpected disconnect, STOMP will try to reconnect.', {
                            code: event?.code,
                            reason: event?.reason,
                            wasClean: event?.wasClean,
                        })
                        return;
                    }
                    onDisconnect && onDisconnect();
                }
            });
            stompClient.current = client;
            client.activate();
        },
        disconnect,
        isConnected: () => {
            return stompClient?.current?.connected;
        }
    };
}