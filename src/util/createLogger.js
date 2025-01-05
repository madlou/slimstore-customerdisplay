export function createLogger({ level }) {
    let logDebug = false;
    let logInfo = false;
    let logError = false;
    switch (level) {
        case 'debug':
            logDebug = true;
        case 'info':
            logInfo = true;
        case 'error':
            logError = true;
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