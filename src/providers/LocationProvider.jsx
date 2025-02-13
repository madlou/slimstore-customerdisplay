import { createContext, useState, useEffect, useContext } from "react";
import { TranslationContext } from './TranslationProvider';
import { useMoney } from '../hooks/useMoney';
import { useApi } from "../hooks/useApi";
import Cookies from 'universal-cookie';

// eslint-disable-next-line react-refresh/only-export-components
export const LocationContext = createContext();

// eslint-disable-next-line react/prop-types
export const LocationProvider = ({ children }) => {
    const cookies = new Cookies();
    const { translations, setLanguage, storeLanguage } = useContext(TranslationContext);
    const [ register, setRegister ] = useState(null);
    const [ location, setLocation ] = useState({ store: null, register: null, pin: null });
    const [ authError, setAuthError ] = useState(null);
    const [ store, setStore ] = useState(null);
    const [ transaction, setTransaction ] = useState(0);
    const { updateMoney, formatMoney } = useMoney();
    const apiError = ( response, json ) => {
        if([400, 401].includes(response.status)){
            setAuthError(json);
        }
    }
    const api = useApi({ url: '/api', onError: apiError });
    const getInitialLocationData = () => {
        api.get(setStore, '/location/' + location.store);
    }
    const authenticationCheck = (response) => {
        if(response.token){
            setAuthError(null);
            cookies.set(
                'store-register',
                location.store + '-' + location.register,
                {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 365,
                    sameSite: 'Strict',
                },
            );
            cookies.set(
                'token',
                response.token,
                {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 365,
                    sameSite: 'Strict',
                },
            );
        } else {
            setAuthError(response.error ?? "Error");
        }
        // TODO: Fix dirty hack - will need a largish refactor to cater for authentication
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
    useEffect(() => {
        if (location.store && location.register) {
            if(location.pin){
                api.get(authenticationCheck, '/public/display/authentication/' 
                    + location.store + '/' + location.register + '/' + location.pin);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ location ])
    useEffect(() => {
        if (store) {
            api.get(setRegister, '/location/' + location.store + '/' + location.register);
            setLanguage(store.languageCode);
            updateMoney({
                currencyCode: store.currencyCode,
                countryCode: store.countryCode,
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ store ])
    useEffect(() => {
        if (register) {
            setTransaction(register.languageCode);
            storeLanguage.current = store.languageCode;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ register ])
    useEffect(() => {
        if (translations && cookies.get('store-register')) {
            const cookieSplit = cookies.get('store-register').split('-');
            setLocation({
                store: cookieSplit[0] * 1,
                register: cookieSplit[1] * 1,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ translations ]);
    return (
        <LocationContext.Provider
            value={{
                authError,
                register, setRegister,
                location, setLocation,
                store, setStore,
                transaction, setTransaction,
                getInitialLocationData,
                formatMoney,
            }}
        >
            { children }
        </LocationContext.Provider>
    );
};
