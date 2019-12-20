/**
 * @file (app)
 */

import React from 'react';
import XuperSDK, {Language, Cryptography} from '@xuperchain/xuper-sdk';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';
import {withSnackbar} from 'notistack';

// components
import Header from '@components/Header';
import Guide from '@pages/Guide';
import Import from '@pages/Import';
import Create from '@pages/Create';
import Main from '@pages/Main';
import theme from '@theme';

// material-ui
import {ThemeProvider} from '@material-ui/core/styles';

// confs
import conf from '@conf';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wallet: this.props.data.wallet || {},
            process: true,
            available: false
        };

        const {chain, node} = conf;
        this.xsdk = XuperSDK.getInstance({
            node,
            chain,
            needEndorse: true,
            endorseConf: conf.endorseConf
        });

        if (this.props.data.wallet) {
            this.xsdk.revertAccount(
                this.props.data.wallet.mnemonic,
                Language.SimplifiedChinese,
                Cryptography.EccFIPS
            );
        }
    }

    componentDidMount() {
        if (!this.state.wallet
            || !this.state.wallet.mnemonic) {
            this.props.history.replace('/');
        } else {
            this.props.history.replace('/main');
        }

        if (this.xsdk) {
            this.setState({
                available: true
            });
        }
    }

    /**
     * change wallet info
     * @param {Object} obj - wallet item
     * @param {boolean} updateStorage - change localstorage value
     */
    changeWalletValues(obj, updateStorage) {
        this.setState(obj, () => {
            if (updateStorage) {
                window.localStorage.setItem('wallet', JSON.stringify(obj));
            }
        });
    }

    clearWallet() {
        localStorage.removeItem('wallet');
        this.props.history.replace('/');
    }

    render() {
        let location = this.props.location;

        return (
            <div className="root">
                <ThemeProvider theme={theme}>
                    {
                        location.pathname !== '/'
                        && (
                            <Header location={location} address={
                                this.state.wallet
                                && this.state.wallet.address
                                || null
                            } clearWallet={this.clearWallet.bind(this)}/>
                        )
                    }
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        flex: 1
                    }}>
                        <Switch>
                            <Route path="/" exact render={() =>
                                <Guide available={this.state.available}/>}/>
                            <Route path="/import" render={() =>
                                <Import
                                    history={this.props.history}
                                    changeValues={this.changeWalletValues.bind(this)}/>}/>
                            <Route path="/create" render={() =>
                                <Create
                                    history={this.props.history}
                                    changeValues={this.changeWalletValues.bind(this)}/>}/>
                            <Route path="/main" render={() =>
                                <Main
                                    wallet={this.state.wallet}
                                    changeValues={this.changeWalletValues.bind(this)}/>
                            }/>
                            <Redirect to="/"/>
                        </Switch>
                    </div>
                </ThemeProvider>
            </div>
        );
    }
}

export default withRouter(withSnackbar(App));
