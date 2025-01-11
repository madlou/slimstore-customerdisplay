import { createContext, useState, useEffect, useContext } from "react";
import { LocationContext } from '../context/LocationProvider';
import { TranslationContext } from "./TranslationProvider";
import { createApi } from "../util/createApi";
import { createSocket } from "../util/createSocket";

export const SocketContext = createContext();

export const SocketProvider = props => {
    const { register, location, getInitialLocationData } = useContext(LocationContext);
    const { languages } = useContext(TranslationContext);
    const [basket, setBasket] = useState([]);
    const [tender, setTender] = useState([]);
    const [status, setStatus] = useState('CONNECTING');
    const [showThankyou, setShowThankyou] = useState(false);
    const socket = createSocket({
        url: '/websocket',
        onConnect: () => {
            setStatus("CONNECTED");
            getInitialLocationData();
            api.get(setBasket, '/basket/' + location.store + '/' + location.register);
            api.get(setTender, '/tender/' + location.store + '/' + location.register);
        },
        onDisconnect: () => {
            setBasket([]);
            setTender([]);
            setStatus("CHANGESTORE");
        },
        onMessage: (message) => {
            if (message.status) {
                setStatus(message.status);
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
    const api = createApi({
        url: '/api',
        onError: socket.disconnect
    });
    useEffect(() => {
        if (languages.length > 0) {
            setStatus('CHANGESTORE')
        }
    }, [languages]);
    useEffect(() => {
        if (register) {
            setStatus(register.status);
        }
    }, [register])
    useEffect(() => {
        if (location.store && location.register) {
            socket.connect(location);
        }
    }, [location]);
    return (
        <SocketContext.Provider
            value={{
                basket, setBasket,
                tender, setTender,
                status, setStatus,
                showThankyou, setShowThankyou,
                socket
            }}
        >
            {props.children}
        </SocketContext.Provider>
    );
};
