/**
 * @file (utils)
 */

export function tokenToCoin(value = 0, precision) {
    let coin = value.toString(10);
    if (coin.indexOf('-') > -1) {
        throw 'Must be an integer';
    }
    let index = coin.indexOf('.');
    if (index > -1) {
        throw 'error value';
    } else {
        if (coin.length - precision >= 0) {
            return (coin.substr(0, coin.length - precision) || '0')
                + '.'
                + coin.substring(coin.length - precision).padEnd(precision, '0');
        } else {
            return '0.'
                + coin.padStart(precision, '0');
        }
    }
}

export function coinToToken(value = 0, precision) {
    if (value === '') {
        value = 0;
    }
    let coin = value.toString(10);
    if (coin.indexOf('-') > -1) {
        throw 'Must be an integer';
    }
    let index = coin.indexOf('.');
    if (index > -1) {
        let fraction = coin.substr(index + 1, coin.length - index);
        if (fraction.length > precision) {
            throw 'error value';
        }
        return coin.substr(0, index - 1)
            + parseFloat(coin.substring(index - 1, coin.length))
                .toFixed(precision)
                .replace('.', '');
    } else {
        return parseFloat(coin)
            .toFixed(precision)
            .replace('.', '');
    }
}

export function format(date, fmt) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1)
                ? (o[k])
                : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
}

/**
 * koa-compose code
 * https://github.com/koajs/compose/blob/master/index.js
 * @param {Function} middlewares funs
 * @return {Function} promise obj
 */
export function compose(middlewares) {
    if (!Array.isArray(middlewares)) {
        throw new TypeError('Middleware stack must be an array!');
    }
    for (const fn of middlewares) {
        if (typeof fn !== 'function') {
            throw new TypeError('Middleware must be composed of functions!');
        }
    }
    return function (context, next) {
        // last called middleware #
        let index = -1;
        return dispatch(0);

        function dispatch(i) {
            if (i <= index) {
                return Promise.reject(new Error('next() called multiple times'));
            }
            index = i;
            let fn = middlewares[i];
            if (i === middlewares.length) {
                fn = next;
            }
            if (!fn) {
                return Promise.resolve();
            }
            try {
                return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
            } catch (err) {
                // Todo: hook error middleware index;
                return Promise.reject(err);
            }
        }
    };

}

export function throttleV2(fn, delay, mustRunDelay) {
    let timer = null;
    let tStart;
    return function () {
        let context = this;
        let args = arguments;
        let tCurr = +new Date();
        clearTimeout(timer);
        if (!tStart) {
            tStart = tCurr;
        }
        if (tCurr - tStart >= mustRunDelay) {
            fn.apply(context, args);
            tStart = tCurr;
        } else {
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        }
    };
}


function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';  //avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
        return successful;

    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        return false;
    } finally {
        document.body.removeChild(textArea);
    }
}

export function copyTextToClipboard(text, cb) {
    const copyEvent = e => {
        e.clipboardData.setData('text/plain', e.target.value);
        document.removeEventListener('copy', copyEvent);
        e.preventDefault();
    };

    document.addEventListener('copy', copyEvent);

    if (!navigator.clipboard) {
        const result = fallbackCopyTextToClipboard(text);
        if (result) {
            cb(result);
        } else {
            document.removeEventListener('copy', copyEvent);
            cb(result);
        }
    }

    if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData('Text', text);

    }

    /*

    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
        cb(true);
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
        cb(false);
    });

     */
}

export function fibonacci(num) {
    if (num <= 1) {
        return 1;
    }
    return fibonacci(num - 1) + fibonacci(num - 2);
}
