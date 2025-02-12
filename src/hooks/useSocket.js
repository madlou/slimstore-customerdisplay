import { useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { useLogger } from './useLogger';
import SockJS from 'sockjs-client';

export function useSocket({ url, onConnect, onDisconnect, onMessage }) {
    const stompClient = useRef(null);
    const location = useRef(null);
    const connectedState = useRef(null);
    if (typeof url !== 'string') {
        throw Error('Expected url to be a string. Received: ' + url);
    }
    const logger = useLogger({
        level: import.meta.env.VITE_LOG_TO_CONSOLE,
    })
    return {
        connect: (locationObject) => {
            connectedState.current = true;
            if (stompClient?.current?.connected == true) {
                logger && logger.info('Socket', 'Already connnected!', true);
                return false;
            }
            const client = new Client({
                webSocketFactory: () => new SockJS(url),
                reconnectDelay: 5000,
                debug: (message) => {
                    logger && logger.debug('Socket Debug', message);
                },
                onConnect: () => {
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
                    });
                    client.publish({
                        destination: '/app/connect',
                        body: JSON.stringify(locationObject),
                    });
                    stompClient.current = client;
                    location.current = locationObject;
                    window.removeEventListener('beforeunload', useSocket.disconnect);
                    window.addEventListener('beforeunload', useSocket.disconnect);
                    onConnect && onConnect();
                },
                onStompError: (frame) => {
                    console.error('Broker reported error: ' + frame.headers['message']);
                    console.error('Additional details: ' + frame.body);
                },
                onWebSocketClose: () => {
                    logger && logger.info('WebSocket Disconnected', location.current, true)
                    if (connectedState.current) {
                        console.error('Unexpected disconnect, trying to reconnect.')
                        setTimeout(() => { window.location.reload() }, 5000);
                    }
                    onDisconnect && onDisconnect();
                }
            });
            client.activate();
        },
        disconnect: () => {
            connectedState.current = false;
            if (stompClient?.current?.connected) {
                stompClient.current.publish({
                    destination: '/app/disconnect',
                    body: JSON.stringify(location.current),
                });
                setTimeout(() => {
                    if(stompClient.current != null){
                        stompClient.current.deactivate();
                        stompClient.current = null;
                    }
                }, 100)
            }
        },
        isConnected: () => {
            return stompClient?.current?.connected;
        }
    };
}