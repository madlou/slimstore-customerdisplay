import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'


document.addEventListener('touchmove', function (event) {
    if (event.scale !== 1) { event.preventDefault(); }
}, { passive: false });

String.prototype.toCamelCase = function () {
    return this.valueOf()
        .replace(/\s(.)/g, function ($1) { return $1.toUpperCase(); })
        .replace(/\s/g, '')
        .replace(/^(.)/, function ($1) { return $1.toLowerCase(); });
}

Number.prototype.pad = function (width, character = '0') {
    const value = '' + this.valueOf();
    return value.length >= width ? value : new Array(width - value.length + 1).join(character) + value;
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
