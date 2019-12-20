/**
 * @file (index)
 */

import React from 'react';
import Container from '@components/Container';
import DialogTemplate from '@components/Dialog';
import {tokenToCoin, coinToToken} from '@libs/utils';
import BN from 'bn.js';
import SDK from '@xuperchain/xuper-sdk';

// material-ui
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide/Slide';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import InputAdornment from '@material-ui/core/InputAdornment';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import CropFreeIcon from '@material-ui/icons/CropFree';

// classes
import styles from './styles.less';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default class extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            addressError: false,
            amount: '',
            amountError: false,
            message: '',
            fee: '0.1', // 需求
            dialog: {
                title: '',
                content: '',
                showCancel: true
            },
            show: true,
            showDialog: false
        };

        this.addressInputRef = React.createRef();

        this.sdk = SDK.getInstance();
    }

    handleResult(result) {
        const {address, amount, fee, message} = this.state;

        this.setState({
            show: !result,
            showDialog: false
        }, () => {
            if (result) {
                // Todo: to main and post tx

                this.props.post(
                    address,
                    amount,
                    fee || '0',
                    message
                );
            }
        });
    }

    handleCloseDialog = () => {
        this.setState({
            showDialog: false
        });
    };

    handleOpenDialog(title, content) {
        let errors = {};

        if (!this.state.address
            || !this.sdk.checkAddress(this.state.address)) {
            errors['addressError'] = true;
        }

        let tAmout = '';
        let tFee = '';

        try {
            tAmout = coinToToken(this.state.amount, 5);
        } catch (e) {
            errors['amountError'] = true;
        }

        try {
            tFee = coinToToken(this.state.fee, 5);
        } catch (e) {
            errors['feeError'] = true;
        }

        const bnAmount = new BN(tAmout);
        const bnFee = new BN(tFee);

        if (bnAmount.lte(new BN(0)) || bnAmount.gt(new BN(this.props.balanceDetail.balance))) {
            errors['amountError'] = true;
        }

        if (bnFee.lt(new BN(0)) || bnFee.gt(new BN(this.props.balanceDetail.balance))) {
            errors['feeError'] = true;
        }

        const sum = bnAmount.add(bnFee);

        if (!this.state.amount
            || this.state.amount === '0'
            || sum.gt(new BN(this.props.balanceDetail.balance))
            || sum.lte(new BN(0))) {
            errors['amountError'] = true;
            errors['feeError'] = true;
        }

        if (errors['addressError'] || errors['amountError'] || errors['feeError']) {
            this.setState(errors);
            return;
        }

        this.setState({
            showDialog: true,
            dialog: {
                title,
                content
            }
        });
    }

    handleChange(field, check, e) {
        if (!e) {
            e = check;
            check = null;
        }
        let tmp = {};

        if (this.state[`${field}Error`]) {
            tmp[`${field}Error`] = false;
        }

        if (check && !check(e.target.value)) {
            return;
        }

        tmp[field] = e.target.value;
        this.setState(tmp);
    }

    handleClose() {
        this.setState({
            show: false
        });
    }

    handleExit() {
        this.props.history.replace('/main');
    }

    handleCloseDialog() {
        this.setState({
            showDialog: false
        });
    }

    /*
    async handlePasteAddress() {
        navigator.permissions.query({name: "clipboard-read"}).then(result => {
            if (result.state == "granted" || result.state == "prompt") {
                navigator.clipboard.read().then(data => {
                    for (let i=0; i<data.items.length; i++) {
                        if (data.items[i].type != "text/plain") {
                            alert("Clipboard contains non-text data. Unable to access it.");
                        } else {
                            textElem.innerText = data.items[i].getAs("text/plain");
                        }
                    }
                });
            }
        })

        document.addEventListener('paste', function(e) {
            // e.clipboardData contains the data that is about to be pasted.
            if (e.clipboardData.types.indexOf('text/html') > -1) {
                var oldData = e.clipboardData.getData('text/html');
                var newData = '<b>Ha Ha!</b> ' + oldData;

                // Since we are canceling the paste operation, we need to manually
                // paste the data into the document.
                pasteClipboardData(newData);

                // This is necessary to prevent the default paste action.
                e.preventDefault();
            }
        });

        document.addEventListener('insertText', function(e) {
        })

        // console.log(await window.navigator.clipboard.readText())
        this.addressInputRef.current.focus()
        this.addressInputRef.current.select();
        var successful = document.execCommand('paste');
        console.log(document.execCommand('insertText'));
        console.log(successful)

    }
     */

    render() {
        return (

            <Dialog fullScreen
                    open={this.state.show}
                    onClose={this.handleClose.bind(this)}
                    TransitionComponent={Transition}
                    TransitionProps={{
                        onExited: this.handleExit.bind(this)
                    }}>
                <AppBar position="relative" className={styles.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={this.handleClose.bind(this)}
                                    aria-label="close">
                            <CloseIcon/>
                        </IconButton>
                        <Typography variant="h6" className={styles.title}>
                            转账
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Container className={styles.frame}>
                    <form noValidate autoComplete="off">
                        <Grid container className={styles.formFrame}>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <TextField
                                            inputRef={this.addressInputRef}
                                            error={this.state.addressError}
                                            required
                                            label="转账地址"
                                            className={styles.textField}
                                            margin="normal"
                                            onChange={this.handleChange.bind(this, 'address')}
                                            value={this.state.address}
                                        />
                                    </Grid>
                                    {
                                        /* 需求
                                        <Grid container>
                                            <IconButton disabled color="primary" className={styles.toolIcon}>
                                                <InsertDriveFileIcon/>
                                            </IconButton>
                                            <IconButton disabled color="primary" className={styles.toolIcon}>
                                                <CropFreeIcon/>
                                            </IconButton>
                                        </Grid>

                                         */
                                    }
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container direction="column">
                                    <Grid item>
                                        <TextField
                                            required
                                            error={this.state.amountError}
                                            label="转账金额"
                                            className={styles.textField}
                                            margin="normal"
                                            type="number"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">Xuper</InputAdornment>
                                                )
                                            }}
                                            onChange={this.handleChange.bind(this, 'amount', v => {
                                                const vStr = v.toString();
                                                const index = vStr.indexOf('.');
                                                if (index > -1
                                                    && vStr.substring(index + 1).length > 5) {
                                                    return false;
                                                }
                                                return true;
                                            })}
                                            value={this.state.amount}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            color={this.props.balanceDetail.balance !== '0' ? 'primary' : 'secondary'}>
                                            当前可用余额{tokenToCoin(this.props.balanceDetail.balance, 5)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    error={this.state.feeError}
                                    label="手续费"
                                    className={styles.textField}
                                    margin="normal"
                                    type="number"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">Xuper</InputAdornment>
                                        )
                                    }}
                                    inputProps={{
                                        step: 1 / 10 ** 5,
                                        min: 1 / 10 ** 5
                                    }}
                                    onChange={this.handleChange.bind(this, 'fee')}
                                    value={this.state.fee}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="转账描述(50字以内)"
                                    multiline
                                    className={styles.textField}
                                    margin="normal"
                                    inputProps={{
                                        maxLength: 50
                                    }}
                                    onChange={this.handleChange.bind(this, 'message')}
                                    value={this.state.message}
                                />
                            </Grid>
                        </Grid>
                        <DialogTemplate
                            open={this.state.showDialog}
                            title={this.state.dialog.title}
                            content={this.state.dialog.content}
                            handleClose={this.handleCloseDialog.bind(this)}
                            handleResult={this.handleResult.bind(this)}
                        />
                        <Button color="primary"
                                variant="contained"
                                onClick={
                                    this.handleOpenDialog.bind(this,
                                        '转账',
                                        (
                                            <React.Fragment>
                                                <Typography variant="body2" component="span"
                                                            display="block">转账地址</Typography>
                                                <Typography className={styles.wordBreak}
                                                            variant="body1"
                                                            component="span"
                                                            display="block">
                                                    {this.state.address}
                                                </Typography>
                                                <br/>
                                                <Typography variant="body2" component="span"
                                                            display="block">转账金额</Typography>
                                                <Typography variant="body1"
                                                            className={styles.wordBreak}
                                                            component="span"
                                                            display="block">
                                                    {this.state.amount}
                                                </Typography>
                                                <br/>
                                                {
                                                    this.state.fee && (
                                                        <React.Fragment>
                                                            <Typography variant="body2" component="span"
                                                                        display="block">手续费</Typography>
                                                            <Typography variant="body1"
                                                                        className={styles.wordBreak}
                                                                        component="span"
                                                                        display="block">
                                                                {this.state.fee}
                                                            </Typography>
                                                        </React.Fragment>
                                                    )
                                                }
                                            </React.Fragment>
                                        )
                                    )}
                        >
                            确认
                        </Button>
                    </form>
                </Container>
            </Dialog>
        );
    }

}
