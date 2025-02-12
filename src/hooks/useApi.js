// import { useState } from "react";
import { useLogger } from "./useLogger";

export function useApi({ url, onError }) {
    // const [ authenticated, setAuthenticated ] = useState(false);
    if (typeof url !== 'string') {
        throw Error('Expected url to be a string. Received: ' + url);
    }
    const logger = useLogger({
        level: import.meta.env.VITE_LOG_TO_CONSOLE,
    })
    return {
        get: async (callback, query) => {
            const response = await fetch(url + query);
            const json = await response.json();
            if (!response.ok) {
                logger && logger.error(url + ' > ' + response.status, json, true);
                onError && setTimeout(()=>{ onError(response, json) }, 1000);
                return;
            }
            logger && logger.info(query, json);
            callback(json);
        },
    };
}