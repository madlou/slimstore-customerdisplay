export function createApi({ url, logger, onError }) {
    if (typeof url !== 'string') {
        throw Error('Expected url to be a string. Received: ' + url);
    }
    return {
        get: async (callback, query) => {
            try {
                const response = await fetch(url + query);
                const json = await response.json();
                logger && logger.info(query, json);
                callback(json);
            } catch {
                logger && logger.error(url, 'ERROR!!', true);
                onError && setTimeout(onError, 1000)
            }
        },
    };
}