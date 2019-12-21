/**
 * @file (requests)
 */

import conf from '@conf';

export function history(params) {
    return fetch(`${conf.xuper}/n/api/explorer/address/transactions?` + paramsToString(params))
        .then(response => response.json())
}

/**
 * to string
 * @param {object} params parameter
 * @return {string} uri string
 */
function paramsToString(params) {
    if (typeof params === 'object') {
        const paramArr = []
        for (const paramKey in params) {
            const paramValue = params[paramKey]
            if (typeof paramValue === 'object') {
                paramArr.push(
                    `${paramKey}=${encodeURIComponent(JSON.stringify(paramValue))}`
                )
            } else if (paramValue) {
                paramArr.push(
                    `${paramKey}=${encodeURIComponent(paramValue)}`
                )
            } else if (typeof paramValue === 'number') {
                // paramsValue = 0
                paramArr.push(
                    `${paramKey}=${paramValue}`
                )
            }
        }
        return paramArr.join('&')
    } else if (typeof params === 'string') return params
    else throw 'Error parameter'
}
