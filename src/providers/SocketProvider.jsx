import { createContext, useState, useEffect, useContext } from "react";
import { LocationContext } from '../providers/LocationProvider';
import { TranslationContext } from "./TranslationProvider";
import { useApi } from "../hooks/useApi";
import { useSocket } from "../hooks/useSocket";

// eslint-disable-next-line react-refresh/only-export-components
export const SocketContext = createContext();

// eslint-disable-next-line react/prop-types
export const SocketProvider = ({ children }) => {
    const { register, location, getInitialLocationData, setTransaction } = useContext(LocationContext);
    const { languages, setLanguage, storeLanguage } = useContext(TranslationContext);
    const [ basket, setBasket ] = useState([]);
    const [ tender, setTender ] = useState([]);
    const [ user, setUser ] = useState(null);
    const [ status, setStatus ] = useState('CONNECTING');
    const [ showThankyou, setShowThankyou ] = useState(false);
    const socket = useSocket({
        url: '/websocket-native',
        onConnect: () => {
            setStatus("CONNECTED");
            getInitialLocationData();
        },
        onDisconnect: () => {
            setBasket([]);
            setTender([]);
            setStatus("CHANGESTORE");
        },
        onMessage: (message) => {
            if (message.register) {
                setStatus(message.register.status);
                setTransaction((message.register.lastTxnNumber ?? -1) + 1)
            }
            if (message.user) {
                setUser(message.user);
            }
            if (message.tender) {
                setTender(message.tender ?? []);
                if (message.tender.length === 0) {
                    setShowThankyou(true);
                    setTimeout(() => {
                        setShowThankyou(false);
                        setLanguage(storeLanguage.current);
                    }, 5000);
                }
            }
            if (message.basket) {
                setBasket(message.basket ?? []);
            }
        },
    });
    const api = useApi({
        url: '/api',
        onError: socket.disconnect
    });
    useEffect(() => {
        if (languages.length > 0) {
            setStatus('CHANGESTORE')
        }
    }, [ languages ]);
    useEffect(() => {
        if (register) {
            api.get(setBasket, '/basket/' + location.store + '/' + location.register);
            api.get(setTender, '/tender/' + location.store + '/' + location.register);
            setStatus(register.status);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ register ])
    useEffect(() => {
        if (location.store && location.register) {
            socket.connect(location);
            return socket.disconnect;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ location.store, location.register ]);
    return (
        <SocketContext.Provider
            value={{
                basket, setBasket,
                tender, setTender,
                user, setUser,
                status, setStatus,
                showThankyou, setShowThankyou,
                socket
            }}
        >
            { children }
        </SocketContext.Provider>
    );
};
