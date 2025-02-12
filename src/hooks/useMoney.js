import { useState } from "react";

export function useMoney(props) {
    const [ currencyCode, setCurrencyCode ] = useState(props?.currencyCode ?? null);
    const [ countryCode, setCountryCode ] = useState(props?.countryCode ?? null);
    const currencyMap = {
        EUR: '€',
        GBP: '£',
        PLN: 'zł',
        USD: '$',
    }
    return {
        updateMoney: (props) => {
            setCurrencyCode(props.currencyCode);
            setCountryCode(props.countryCode);
        },
        formatMoney: (value) => {
            const sign = (value * 1) < 0 ? '-' : '';
            value = Math.abs(value);
            switch (countryCode) {
                case 'DE':
                    return sign + value.toFixed(2) + ' ' + currencyMap[currencyCode];
                case 'ES':
                    return sign + value.toFixed(2) + ' ' + currencyMap[currencyCode];
                case 'FR':
                    return sign + value.toFixed(2) + ' ' + currencyMap[currencyCode];
                case 'IE':
                    return sign + currencyMap[currencyCode] + value.toFixed(2);
                case 'PL':
                    return sign + value.toFixed(2) + ' ' + currencyMap[currencyCode];
                case 'UK':
                    return sign + currencyMap[currencyCode] + value.toFixed(2);
                case 'US':
                    return sign + value.toFixed(2) + ' ' + currencyMap[currencyCode];
            }
        }
    }
}
