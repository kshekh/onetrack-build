import { LoadingState, CurrencySymbol, TimeZone } from '$lib/store';
import { NumberWithCommas } from './StatsHelpers';
import getOffset from '$lib/local-packages/TimezoneOffsetLib';
import { get } from 'svelte/store';
import _ from 'underscore';

export function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
export function showLoader(caption) {
    LoadingState.set({ show: true, caption: caption })
}
export function hideLoader() {
    LoadingState.set({ show: false, caption: "" });
}

export function checkPasswordValidation(value) {

    //Requirements
    const isContainsUppercase = /^(?=.*[A-Z])/;
    const isContainsLowercase = /^(?=.*[a-z])/;
    const isContainsNumber = /^(?=.*[0-9])/;
    const isValidLength = /^.{8,100}$/;
    const isContainsSymbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/;

    //Tests
    if (!isContainsUppercase.test(value)) {
        return "Password must have at least one Uppercase Character.";
    }

    if (!isContainsLowercase.test(value)) {
        return "Password must have at least one Lowercase Character.";
    }

    if (!isContainsNumber.test(value)) {
        return "Password must contain at least one Digit.";
    }

    if (!isContainsSymbol.test(value)) {
        return "Password must contain at least one Special Symbol.";
    }

    if (!isValidLength.test(value)) {
        return "Password must be at least 8 Characters Long.";
    }
    //All validations met
    return null;
}

export function dispatchResize() {
    window.dispatchEvent(new Event('resize'));
}
export function TransformCurrencyValue(CurrencyValue, precision = 0, showSymbol = true) {
    if (CurrencyValue == undefined) {
        CurrencyValue = "0";
    }
    let euroSym = "€";
    let dollarSym = "$";
    let symValue = "";
    if (showSymbol) {
        symValue = get(CurrencySymbol);
    }
    if (showSymbol) {
        if (symValue == "USD") {
            if (CurrencyValue == 0) {
                return `${dollarSym}${CurrencyValue}`;
            }
            return `${dollarSym}${NumberWithCommas(Number(CurrencyValue).toFixed(precision))}`;
        }
        if (symValue == "EUR") {
            if (CurrencyValue == 0) {
                return `${CurrencyValue}${euroSym}`;
            }
            return `${NumberWithCommas(Number(CurrencyValue).toFixed(precision))}${euroSym}`;
        }
    }
    else {
        if (CurrencyValue == 0) {
            return `${CurrencyValue}`;
        }
        return `${NumberWithCommas(Number(CurrencyValue).toFixed(precision))}`;
    }
}
export function getTimeZoneOffsetInSeconds() {
    let timezone = get(TimeZone);
    let d = new Date();
    return getOffset(timezone, d);
}
export const sortComparer = (a, b) => {
    if (a) {
        a = Number(a);
    }
    else {
        a = 0;
    }
    if (b) {
        b = Number(b);
    }
    else {
        b = 0;
    }

    if (a > b) {
        return 1;
    } else if (b > a) {
        return -1;
    } else {
        return 0;
    }
}
export const stringSortComparer = (a, b) => {
    if (a) {
        a = a.toLowerCase();
    }
    else {
        a = "";
    }

    if (b) {
        b = b.toLowerCase();
    }
    else {
        b = "";
    }

    if (a > b) {
        return 1;
    } else if (b > a) {
        return -1;
    } else {
        return 0;
    }
}
export const createNewElement = (tag, params) => {
    let element = document.createElement(tag);
    if (params) {
        Object.keys(params).forEach((key) => {
            if (key === 'class') {
                Array.isArray(params[key])
                    ? params[key].forEach((o) => (o !== '' ? element.classList.add(o) : 0))
                    : params[key] !== ''
                        ? element.classList.add(params[key])
                        : 0;
            } else if (key === 'style') {
                Object.keys(params[key]).forEach((value) => {
                    element.style[value] = params[key][value];
                });
            } else if (key === 'text') {
                params[key] === '' ? (element.innerHTML = '&nbsp;') : (element.innerText = params[key]);
            } else if (key === 'html') {
                element.innerHTML = params[key];
            } else {
                element[key] = params[key];
            }
        });
    }
    return element;
};
export const currencyFormatter = (cell) => TransformCurrencyValue(cell, 2, true);
export const noFormatter = (cell) => cell;
export const percentageFormatter = (cell) => {
    if (!cell || isNaN(cell)) {
        "0%"
    }
    if (cell === 1) {
        return `${(cell * 100)}%`
    }
    return `${(cell * 100).toFixed(2)}%`;
};
export const percentageSymbolFormatter = (cell) => `${cell}%`;
export function clickOutside(node, dropDownId) {
    const handleClick = event => {
        if (event.target.classList.value.includes(dropDownId)) {
            return;
        }
        if (node && !node.contains(event.target) && !event.defaultPrevented) {
            node.dispatchEvent(
                new CustomEvent('click_outside', node)
            )
        }
    }

    document.addEventListener('click', handleClick, true);

    return {
        destroy() {
            document.removeEventListener('click', handleClick, true);
        }
    }
}
export function getAverage(list, precision = 0) {
    list = list.filter(Boolean);
    let noOfItems = 0;
    let sum = 0;
    list.forEach(item => {
        sum += Number(item);
        noOfItems += 1;
    });
    if (sum === 0) {
        return 0;
    }
    return (sum / noOfItems).toFixed(precision);
}
export function getSum(list, precision = 0) {
    list = list.filter(Boolean);
    let sum = 0;
    list.forEach(item => {
        sum += Number(item);
    });
    return sum.toFixed(precision);
}
export function groupByAndSelectOne(data, property) {
    let output = [];
    let groups = _.groupBy(data, property);
    for (let key in groups) {
        let item = groups[key];
        output.push(item[0]);
    }
    return output;
}


export function saveToLocalStorage(key, data, convertToString = false) {
    try {
        if (convertToString) {
            data = JSON.stringify(data);
        }
        localStorage.setItem(key, data);
    }
    catch (err) {
        console.error(err);
    }

}
export function readFromLocalStorage(key, convertToJson = false) {
    try {
        let data = localStorage.getItem(key);
        if (convertToJson) {
            data = JSON.parse(data);
        }
        return data;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}
/**
 * Returns a hash code from a string
 */
export function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}