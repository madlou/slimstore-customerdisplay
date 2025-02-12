import { createContext, useState, useEffect, useRef } from "react";
import { useApi } from "../hooks/useApi";

// eslint-disable-next-line react-refresh/only-export-components
export const TranslationContext = createContext();

// eslint-disable-next-line react/prop-types
export const TranslationProvider = ({ children }) => {
    const [ language, setLanguage ] = useState('EN');
    const [ languages, setLanguages ] = useState([]);
    const [ translations, setTranslations ] = useState(null);
    const storeLanguage = useRef(null);
    const apiError = () => {}
    const api = useApi({ url: '/api', apiError});
    useEffect(() => {
        api.get(setTranslations, '/public/translations/' + language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ language ])
    useEffect(() => {
        api.get(setLanguages, '/public/languages');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <TranslationContext.Provider
            value={{
                language, setLanguage,
                languages, setLanguages,
                storeLanguage,
                translations, setTranslations,
            }}
        >
            { children }
        </TranslationContext.Provider>
    );
};
