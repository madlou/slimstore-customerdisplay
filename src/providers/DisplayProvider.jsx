import { createContext, useState, useEffect, useContext } from "react";
import { LocationContext } from '../providers/LocationProvider';
import { TranslationContext } from "./TranslationProvider";
import { useApi } from "../hooks/useApi";
import { useSocket } from "../hooks/useSocket";

// eslint-disable-next-line react-refresh/only-export-components
export const DisplayContext = createContext();

// eslint-disable-next-line react/prop-types
export const DisplayProvider = ({ children }) => {
    const { register, location, getInitialLocationData, setTransaction } = useContext(LocationContext);
    const { languages, setLanguage, storeLanguage } = useContext(TranslationContext);
    const [ basket, setBasket ] = useState([]);
    const [ tender, setTender ] = useState([]);
    const [ status, setStatus ] = useState('CONNECTING');
    const [ showThankyou, setShowThankyou ] = useState(false);
    const socket = useSocket({
        url: '/websocket',
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
                setTransaction(message.register.lastTransactionNumber + 1)
            } else if (message.tender) {
                setTender(message.tender ?? []);
                if (message.tender.length === 0) {
                    setShowThankyou(true);
                    setTimeout(() => {
                        setShowThankyou(false);
                        setLanguage(storeLanguage.current);
                    }, 5000);
                }
            } else {
                setBasket(message.basket ?? []);
                setTender(message.tender ?? []);
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
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ location ]);
    return (
        <DisplayContext.Provider
            value={{
                basket, setBasket,
                tender, setTender,
                status, setStatus,
                showThankyou, setShowThankyou,
                socket
            }}
        >
            { children }
        </DisplayContext.Provider>
    );
};
