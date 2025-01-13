import { createContext, useState, useEffect, useContext } from "react";
import Cookies from 'universal-cookie';
import { TranslationContext } from './TranslationProvider';
import { createApi } from "../util/createApi";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const cookies = new Cookies();
    const { setLanguage, storeLanguage } = useContext(TranslationContext);
    const [register, setRegister] = useState(null);
    const [location, setLocation] = useState({ store: null, register: null });
    const [store, setStore] = useState(null);
    const api = createApi({ url: '/api' });
    const getInitialLocationData = () => {
        api.get(setStore, '/location/' + location.store);
        api.get(setRegister, '/location/' + location.store + '/' + location.register);
    }
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
        }
    }, [location])
    useEffect(() => {
        if (store) {
            setLanguage(store.languageCode);
            storeLanguage.current = store.languageCode;
        }
    }, [store])
    useEffect(() => {
        if (cookies.get('store-register')) {
            const cookieSplit = cookies.get('store-register').split('-');
            setLocation({
                store: cookieSplit[0] * 1,
                register: cookieSplit[1] * 1,
            });
        }
    }, []);
    return (
        <LocationContext.Provider
            value={{
                register, setRegister,
                location, setLocation,
                store, setStore,
                getInitialLocationData
            }}
        >
            {children}
        </LocationContext.Provider>
    );
};
