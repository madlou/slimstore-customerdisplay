import { createContext, useState, useEffect, useRef } from "react";
import { createApi } from "../util/createApi";

export const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
    const [language, setLanguage] = useState('EN');
    const [languages, setLanguages] = useState([]);
    const [translations, setTranslations] = useState(null);
    const storeLanguage = useRef(null);
    const api = createApi({ url: '/api' });
    useEffect(() => {
        api.get(setTranslations, '/ui/translations/' + language)
    }, [language])
    useEffect(() => {
        api.get(setLanguages, '/languages');
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
            {children}
        </TranslationContext.Provider>
    );
};
