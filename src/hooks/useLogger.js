export function useLogger({ level }) {
    let logDebug = false;
    let logInfo = false;
    let logError = false;
    switch (level) {
        case 'debug':
            logDebug = true;
            logInfo = true;
            logError = true;
            break;
        case 'info':
            logInfo = true;
            logError = true;
            break;
        case 'error':
            logError = true;
            break;
    }
    return {
        debug: (key, value) => {
            if (logDebug) {
                console.debug(key, value)
            }
        },
        info: (key, value) => {
            if (logInfo) {
                console.log(key, value)
            }
        },
        error: (key, value) => {
            if (logError) {
                console.error(key, value)
            }
        },
    };
}