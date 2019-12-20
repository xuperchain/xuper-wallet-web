/**
 * @file (index)
 */

import React from 'react';
import {tokenToCoin, copyTextToClipboard} from '@libs/utils';

// material-ui
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';
import CallReceived from '@material-ui/icons/CallReceived';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Skeleton from '@material-ui/lab/Skeleton';
import {withSnackbar} from 'notistack';

// styles
import styles from './styles.less';

const WalletCard = props => {

    let [openTopupAlert, setOpenTopupAlert] = React.useState(false);
    let [openReceiveAlert, setOpenReceiveAlert] = React.useState(false);
    let [copyError, setCopyError] = React.useState(false);

    const handleClick = () => {
        setOpenTopupAlert(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        if (openReceiveAlert) {
            setOpenReceiveAlert(false);
        }

        if (openTopupAlert) {
            setOpenTopupAlert(false);
        }
    };

    const handleSend = () => {
        props.history.push('/main/wallet/transaction');
    };

    const handleCopy = value => {
        copyTextToClipboard(value, success => {
            console.log(success);
            if (success) {
                setOpenReceiveAlert(false);
                props.enqueueSnackbar('复制完成', {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center',
                    }
                });
            } else {
                setCopyError(true);
            }

        });
    };

    const handleReceive = e => {
        setOpenReceiveAlert(true);
    };

    return (
        <React.Fragment>
            <Card className={styles.frame}>
                <Grid container>
                    <CardContent style={{flex: 1, position: 'relative', overflow: 'hidden', paddingRight: 5}}>
                        <div>
                            <Typography variant="subtitle2" component="p" className={styles.subTitle}>
                                可用余额（Xuper）{/*UI改动*/}
                            </Typography>
                            {
                                props.balanceDetail
                                && props.balanceDetail.balance !== undefined
                                && props.balanceDetail.balance !== ''
                                    ? (
                                        <Typography variant="inherit"
                                                    component="p"
                                                    noWrap
                                                    className={styles.coin}>
                                            <Typography variant="inherit"
                                                        noWrap
                                                        className={styles.coin}>
                                                {tokenToCoin(props.balanceDetail.balance, 5)}
                                            </Typography>
                                            {
                                                /* 需求
                                                <Typography gutterBottom variant="subtitle2"
                                                            component="span"
                                                            className={styles.xuper}>
                                                    &nbsp;Xuper
                                                </Typography>
                                                 */
                                            }
                                        </Typography>
                                    )
                                    : (<Skeleton variant="rect" width="80%" height={32}/>)
                            }

                        </div>
                        <div>
                            <Typography variant="subtitle2" component="p" className={styles.subTitle}>
                                冻结余额（Xuper）{/*UI改动*/}
                            </Typography>
                            {
                                props.balanceDetail
                                && props.balanceDetail.frozen !== undefined
                                && props.balanceDetail.frozen !== ''
                                    ? (
                                        <Typography variant="inherit"
                                                    component="p"
                                                    noWrap
                                                    className={styles.coin}>
                                            <Typography variant="inherit"
                                                        noWrap
                                                        className={styles.subCoin}>
                                                {tokenToCoin(props.balanceDetail.frozen, 5)}
                                            </Typography>
                                            {
                                                /* 需求
                                                <Typography gutterBottom variant="subtitle2"
                                                            component="span"
                                                            className={styles.xuper}>
                                                    &nbsp;Xuper
                                                </Typography>
                                                 */
                                            }
                                        </Typography>
                                    )
                                    : (<Skeleton variant="rect" width="60%" height={32}/>)
                            }
                        </div>
                    </CardContent>
                    <CardContent className={styles.topUpBtn}>
                        <Button size="small" color="primary" style={{minWidth: 44, fontSize: 18}}
                                onClick={handleClick}>
                            充值
                        </Button>
                    </CardContent>
                </Grid>
                <CardActions>
                    <Button variant="contained" size="small" color="primary"
                            onClick={handleSend}
                            disabled={props.balanceDetail.balance === null
                            || props.balanceDetail.balance === undefined
                            || props.verifyError}
                            style={{marginLeft: 'auto'}}
                            startIcon={<SendIcon/>}>
                        转账
                    </Button>
                    <Button variant="contained"
                            size="small"
                            color="primary"
                            startIcon={<CallReceived/>}
                            onClick={handleReceive}
                            className={'copy-btn'}
                    >
                        转入
                    </Button>
                </CardActions>
            </Card>
            <Dialog open={openTopupAlert}
                    onClose={handleClose}
                    fullWidth
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">进入baas平台充值Xuper</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        ①点击如下链接 → ②登录百度账号 → ③绑定当前钱包账户 → ④再次点击链接，开始充值
                        <br/><br/>
                        地址：<a href="https://xchain.baidu.com/n/console#/finance/wallet/recharge"
                              target="_blank"
                              style={{wordBreak: 'break-word'}}
                              rel="noopener">
                        https://xchain.baidu.com/n/console#/finance/wallet/recharge
                    </a>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        确定
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openReceiveAlert}
                    onClose={handleClose}
                    fullWidth
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">账户地址</DialogTitle>
                <DialogContent>
                    <DialogContentText className={styles.wordBreak} id="alert-dialog-description">
                        {copyError && (
                            <Typography color="secondary" style={{marginBottom: 10}}>
                                浏览器复制失败，请长按文本复制
                            </Typography>
                        )}
                        {props.address}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary"
                            className={'copy-btn'}
                            onClick={handleCopy.bind(null, props.address)}
                    >
                        复制
                    </Button>
                    {
                        /* 需求
                        <Button onClick={handleClose} color="primary" autoFocus>
                            确定
                        </Button>
                         */
                    }
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default withSnackbar(WalletCard);
