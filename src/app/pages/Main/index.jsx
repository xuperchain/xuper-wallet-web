/**
 * @file (index)
 */

import React from 'react';
import {withSnackbar} from 'notistack';
import {Switch, Route, Link, withRouter, Redirect} from 'react-router-dom';

/*
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import PaymentIcon from '@material-ui/icons/Payment';
import SettingsIcon from '@material-ui/icons/Settings';
import HistoryIcon from '@material-ui/icons/History';
 */

import Container from '@components/Container';
import Settings from '@pages/Settings';
import Transaction from '@pages/Transaction';
import WalletCard from '@pages/WalletCard';
import WalletWarn from '@pages/WalletWarn';
import History from '@pages/History';
import XuperSDK from '@xuperchain/xuper-sdk';

import {history} from '@libs/requests';
import {coinToToken, fibonacci, throttleV2} from '@libs/utils';

// classes
import styles from './styles.less';

let mainDom = document.querySelector('main');


class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navValue: this.getNavIndex(props.location.pathname),
            verifyError: false,
            openTransaction: false,
            balanceDetail: {},
            historyList: []
        };

        this.loading = false;
        this.pn = 1;
    }

    componentDidMount() {
        this.sdk = XuperSDK.getInstance();
        if (this.props.wallet && this.props.wallet.address) {
            this.syncSDK(true);
        }
        mainDom.addEventListener('scroll', this.handleScroll.bind(this));
    }

    componentWillUnmount() {
        mainDom.removeEventListener('scroll', this.handleScroll.bind(this));
    }

    handleScroll(e) {
        throttleV2(() => {
            if ((mainDom.scrollHeight - mainDom.clientHeight * 2) < mainDom.scrollTop
                && !this.loading) {
                if (this.state.historyList.length % 50 === 0) {
                    this.loading = true;
                    this.loadMoreItems(++this.pn, 50)
                }
            }
        }, 200, 300)()

    }

    getNavIndex(pathname) {
        switch (pathname) {
            case '/main':
                return 0;
            case '/main/settings':
                return 2;
            default:
                return 0
        }
    }

    handleChangeDialog() {
        this.setState({
            openTransaction: !this.state.openTransaction
        })
    }

    async loadMoreItems(pn, ps) {
        const result = await history({
            chain: 'xuper',
            type: 1,
            net_id: 5,
            address: this.props.wallet.address,
            pn,
            ps
        });

        if (result && result.data['tx_lists']) {
            const tmp = this.state.historyList.concat(result.data['tx_lists']);

            this.setState({
                historyList: tmp
            }, () => {
                this.loading = false;
            });
        }
    }

    /**
     * Get current wallet balance
     * @return {Promise<void>}
     */
    async getBalance() {
        try {
            const balance = await this.sdk.getBalanceDetail();

            this.setState({
                balanceDetail: {
                    frozen: balance.tfds[0].tfd[0].balance,
                    balance: balance.tfds[0].tfd[1].balance
                }
            })
        }
        catch (e) {
            this.setState({
                balanceDetail: {
                    frozen: 0,
                    balance: 0
                }
            });
            this.props.enqueueSnackbar('节点服务器异常，请稍后再试！', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center'
                }
            });
        }
    }

    async getHistory() {
        try {
            const result = await history({
                chain: 'xuper',
                type: 1,
                net_id: 5,
                address: this.props.wallet.address,
                pn: 1,
                ps: 50
            });

            if (result && result.data['tx_lists']) {
                let historyList = result.data['tx_lists'];
                this.setState({
                    historyList
                });
            }
        }
        catch (e) {

            this.props.enqueueSnackbar('交易记录服务器异常，请稍后再试！', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center'
                }
            });

            throw e
        }

    }

    /**
     * sync wallet infomation
     * @param {boolean} verify - need nerify
     * @return {Promise<void>}
     */
    async syncSDK(verify) {

        this.getBalance();
        this.getHistory();

        try {
            if (verify) {
                await this.sdk.preExecTransaction(this.props.wallet.address, 0, 0, 1);
            }
        }
        catch (e) {

            if (e.error
                && (e.error.indexOf('verify initiator error') > -1
                    || e.error.indexOf('identity check failed') > -1)) {
                this.setState({
                    verifyError: true
                });
            }
            else if (e.error
                && e.error.indexOf('NOT_ENOUGH_UTXO_ERROR') > -1) {
                // Todo: fix
            }
            else {
                this.props.enqueueSnackbar('节点服务器异常，请稍后再试！', {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center',
                    }
                });
            }
        }

    }

    /**
     * post tx
     * @param {string} to - to address
     * @param {string} amount
     * @param {string} fee
     * @param {string} desc
     * @return {Promise<void>}
     */
    async post(to, amount, fee, desc) {
        this.props.enqueueSnackbar('已发起交易(若交易成功，将新增一条交易记录)', {
            variant: 'info',
            // 需求
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
            }
        });

        try {

            const tx = await this.sdk.makeTrasaction(to,
                coinToToken(amount, 5),
                coinToToken(fee, 5),
                desc
            );
            await this.sdk.postTransaction(tx);
            this.props.enqueueSnackbar('交易上链中', {
                variant: 'info',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center'
                }
            });

            let times = 0;

            const check = () => {
                if (times < 7) {
                    let t = setTimeout(async () => {
                        times++;
                        let result = await this.sdk.queryTransaction(tx.txid);
                        if (result.status === 'CONFIRM') {
                            this.props.enqueueSnackbar('交易已上链', {
                                variant: 'success',
                                anchorOrigin: {
                                    vertical: 'top',
                                    horizontal: 'center',
                                }
                            });
                            this.getBalance();
                            this.getHistory();
                            return true;
                        }
                        else if (result.status === 'NOEXIST') {
                            this.props.enqueueSnackbar('交易不存在', {
                                variant: 'error',
                                anchorOrigin: {
                                    vertical: 'top',
                                    horizontal: 'center',
                                }
                            });
                            return false;
                        }
                        else {
                            clearTimeout(t);
                            return check();
                        }

                    }, fibonacci(times) * 1000);
                }
                else {
                    return false;
                }
            };
            if (check()) {
                this.getBalance();
                this.getHistory();
            }

        } catch (e) {

            const jsonErr = e;

            if (jsonErr.error
                && jsonErr.error.indexOf('invalid to_address') > -1) {
                this.props.enqueueSnackbar('交易失败，暂时无法向该类账户转账', {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                });
            }
            else {
                this.props.enqueueSnackbar('交易失败', {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    }
                });
            }


            throw e;
        }
    }

    render() {
        return (
            <div className={styles.frame}>
                <Container className={styles.mainFrame}>
                    <Switch>
                        <Route path="/main"
                               render={
                                   () =>
                                       <React.Fragment>
                                           {
                                               this.state.verifyError && (
                                                   <WalletWarn/>
                                               )
                                           }
                                           <WalletCard
                                               address={this.props.wallet.address}
                                               history={this.props.history}
                                               verifyError={this.state.verifyError}
                                               balanceDetail={this.state.balanceDetail}/>
                                           <History historyList={this.state.historyList}
                                                    loadMoreItems={this.loadMoreItems.bind(this)}/>
                                           <Route path="/main/wallet/transaction" render={() =>
                                               <Transaction
                                                   {...this.props}
                                                   post={this.post.bind(this)}
                                                   balanceDetail={this.state.balanceDetail}
                                                   closeDialog={this.handleChangeDialog}
                                               />
                                           }
                                           />
                                       </React.Fragment>
                               }
                        />
                        <Route path="/main/settings" render={
                            () => <Settings changeValues={this.props.changeValues} conf={this.props.wallet.conf}/>
                        }/>
                        <Redirect to="/main"/>
                    </Switch>
                </Container>
                {
                    /* 需求
                    <BottomNavigation
                        value={this.state.navValue}
                        onChange={(event, newValue) => {
                            this.setState({
                                navValue: newValue
                            }, () => {
                                switch (newValue) {
                                    case 0:
                                        this.props.history.replace('/main/wallet');
                                        break;
                                    case 2:
                                        this.props.history.replace('/main/settings');
                                        break;
                                    default:
                                        this.props.history.replace('/main/wallet');
                                }
                            });
                        }}
                        showLabels
                        className={styles.root}
                    >
                        <BottomNavigationAction label="钱包" icon={<PaymentIcon/>}/>
                        <BottomNavigationAction disabled label="交易记录" icon={<HistoryIcon/>}/>
                        <BottomNavigationAction label="设置" icon={<SettingsIcon/>}/>
                    </BottomNavigation>

                     */
                }
            </div>
        )
    }
}

export default withRouter(withSnackbar(Main));
