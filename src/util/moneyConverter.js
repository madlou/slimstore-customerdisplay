const moneyConverter = (countryCode, currency, value) => {
    const currencyMap = {
        EUR: '€',
        GBP: '£',
        PLN: 'zł',
        USD: '$',
    }
    const sign = (value * 1) < 0 ? '-' : '';
    value = Math.abs(value);
    switch (countryCode) {
        case 'DE':
            return sign + value.toFixed(2) + ' ' + currencyMap[currency];
        case 'ES':
            return sign + value.toFixed(2) + ' ' + currencyMap[currency];
        case 'FR':
            return sign + value.toFixed(2) + ' ' + currencyMap[currency];
        case 'IE':
            return sign + currencyMap[currency] + value.toFixed(2);
        case 'PL':
            return sign + value.toFixed(2) + ' ' + currencyMap[currency];
        case 'UK':
            return sign + currencyMap[currency] + value.toFixed(2);
        case 'US':
            return sign + value.toFixed(2) + ' ' + currencyMap[currency];
    }
}

export default moneyConverter