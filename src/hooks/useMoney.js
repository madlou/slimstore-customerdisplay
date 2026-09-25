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
            var output = '';
            switch (countryCode) {
                case 'DE':
                    output = sign + value.toFixed(2) + ' ' + currencyMap[currencyCode];
                    break;
                case 'ES':
                    output = sign + value.toFixed(2) + ' ' + currencyMap[currencyCode];
                    break;
                case 'FR':
                    output = sign + value.toFixed(2) + ' ' + currencyMap[currencyCode];
                    break;
                case 'IE':
                    output = sign + currencyMap[currencyCode] + value.toFixed(2);
                    break;
                case 'PL':
                    output = sign + value.toFixed(2) + ' ' + currencyMap[currencyCode];
                    break;
                case 'UK':
                    output = sign + currencyMap[currencyCode] + value.toFixed(2);
                    break;
                case 'US':
                    output = sign + value.toFixed(2) + ' ' + currencyMap[currencyCode];
                    break;
                default:
                    output = value.toFixed(2);
                    break;
            }
            return output;
        }
    }
}
