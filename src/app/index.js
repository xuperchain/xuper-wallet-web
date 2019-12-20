/**
 * @file (index)
 */

import React from 'react';
import {render} from 'react-dom';

import App from './App';
import {HashRouter as Router} from 'react-router-dom';
import {SnackbarProvider} from 'notistack';

import 'normalize.css';
import '@public/styles/base.css';

let walletObj = {};
window.addEventListener('storage', e => {});

if (window.localStorage) {
    let tmpWallet = window.localStorage.getItem('wallet');
    if (tmpWallet) {
        try {
            walletObj = JSON.parse(tmpWallet);
        } catch (e) {
        }
    }
}

render(
    <Router>
        <SnackbarProvider maxSnack={3} autoHideDuration={1500}>
            <App data={walletObj}/>
        </SnackbarProvider>
    </Router>,
    document.querySelector('main')
);
