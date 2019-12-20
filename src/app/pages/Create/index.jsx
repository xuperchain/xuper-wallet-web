/**
 * @file (index)
 */

import React from 'react';
import clsx from 'clsx';
import XuperSDK, {Language, Strength, Cryptography} from '@xuperchain/xuper-sdk';
import {Link} from 'react-router-dom';

// components
import Container from '@components/Container';

// materail-ui
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import HighlightOff from '@material-ui/icons/HighlightOff';
import LinearProgress from '@material-ui/core/LinearProgress';

// styles
import styles from './styles.less';

export default class extends React.Component {

    steps = ['记录助记词', '验证助记词', '成功'];

    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
            mnemonic: null,
            tempMnemonic: [],
            mem: [],
            failValidate: false
        };
    }

    componentDidMount() {
        try {
            this.createAccount();
        }
        catch (e) {
            alert(e);
        }
    }

    async createAccount() {
        const xsdk = XuperSDK.getInstance();
        const wallet = await xsdk.createAccount(Language.SimplifiedChinese, Strength.Easy, Cryptography.EccFIPS);
        const mnemonicArr = wallet.mnemonic.split(' ');
        this.setState({
            mnemonic: mnemonicArr,
            tempMnemonic: this.fisherYates([...new Set(mnemonicArr)].splice(0, 8)),
            wallet
        });
    }

    handleWord = word => {
        let mem = this.state.mem;
        if (mem.length === 6) {
            return;
        }
        mem.push(word);
        this.setState({
            mem
        });
    };

    handleClickClear = () => {
        this.setState({
            mem: [],
            failValidate: false
        });
    };

    handleBack = () => {
        const prevActiveStep = this.state.activeStep;
        this.setState({
            activeStep: prevActiveStep - 1
        });
    };

    handleNext = opts => {
        const prevActiveStep = this.state.activeStep;
        if (prevActiveStep === 1
            && JSON.stringify(this.state.mem)
            !== JSON.stringify(this.state.mnemonic.slice(0, 6))) {
            this.setState({
                failValidate: true
            });
        } else {
            this.setState({
                failValidate: false,
                activeStep: prevActiveStep + 1
            }, () => {
                if (prevActiveStep + 1 === 3) {
                    this.props.changeValues({
                        wallet: this.state.wallet
                    }, opts.cache);
                    this.props.history.push('/main');
                }
            });
        }
    };

    getStepContent(step) {
        switch (step) {
            case 0:
                return '助记词非常重要，请务必抄写下来并妥善保管，不要轻易在任何第三方' +
                    '平台使用助记词，它包含了恢复钱包时所需要的所有信息';
            case 2:
                return '验证成功，是否下次默认登录当前钱包账户？(本地存储具有安全风险)';
            default:
                return null;
        }
    }

    getStepTitle(step) {
        switch (step) {
            case 0:
                return '备份你的助记词';
            case 1:
                return '请按照助记词的前6位，依次点选下列文字';
            default:
                return null;

        }
    }

    fisherYates(arr) {
        arr = Object.assign([], arr);
        for (let i = 1; i < arr.length; i++) {
            const random = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[random]] = [arr[random], arr[i]];
        }
        return arr;
    }

    getStepComponent(step) {
        switch (step) {
            case 0:
                if (this.state.mnemonic) {
                    return (
                        <ul className={styles.words}>
                            {
                                this.state.mnemonic.map((word, index) => {
                                    return (
                                        <li key={`li_${index}`}
                                            className={styles.word}>{word}</li>
                                    );
                                })
                            }
                        </ul>
                    );
                } else {
                    return <LinearProgress className={styles.progress}
                                           variant="query"
                                           color="secondary"/>;
                }

            case 1:
                return (
                    <Grid container direction="column">
                        <Grid item>
                            <div className={styles.mnemonicFrame}>
                            <TextField
                                error={this.state.failValidate}
                                value={this.state.mem.join(' ')}
                                className={styles.mnemonicField}
                                InputProps={{
                                    readOnly: true,
                                    endAdornment:
                                        this.state.mem
                                        && this.state.mem.length > 0
                                        && (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="clear"
                                                    onClick={this.handleClickClear}
                                                >
                                                    <HighlightOff/>
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                }}
                            />
                            </div>
                        </Grid>

                        <Grid item>
                            <Grid container>
                                <ul className={styles.words}>
                                    {
                                        this.state.tempMnemonic.map((word, index) => (
                                            <li className={styles.word}
                                                key={`li_${index}`}
                                                onClick={this.handleWord.bind(null, word)}
                                            >
                                                {word}
                                            </li>
                                        ))
                                    }
                                </ul>
                            </Grid>
                        </Grid>
                    </Grid>
                );
        }
    }

    getStepSubComponent(step) {
        switch (step) {
            case 1:
                return (
                    <p className={styles.remark}>选择前六位助记词认证确认</p>
                );
            default:
                return null;
        }
    }

    getStepSubButton(step) {
        switch (step) {
            case 2:
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        className={clsx(styles.stepBtn)}
                        size='small'
                        onClick={this.handleNext.bind(this, {cache: true})}
                    >
                        是
                    </Button>
                );
            default:
                return null;
        }
    }

    render() {

        const index = this.state.activeStep;
        const label = this.steps[index];

        return (
            <Container className={styles.frame}>
                <div className={styles.stepFrame}>
                    {
                        <div className={styles.step}>
                            <Typography className={styles.stepTitle}>{this.getStepTitle(index)}</Typography>
                            <Typography className={styles.stepLabel}
                                        color="secondary">{this.getStepContent(index)}</Typography>
                            <Typography component="div">{this.getStepComponent(index)}</Typography>
                            <div className={styles.stepBtns}>
                                {
                                    this.state.activeStep !== 0 && (
                                        <Button
                                            disabled={this.state.activeStep === 0
                                            || this.state.activeStep === this.steps.length -1}
                                            onClick={this.handleBack}
                                            className={clsx(styles.stepBtn, styles.stepBtnBorder)}
                                            size='small'
                                        >
                                            上一步
                                        </Button>
                                    )
                                }
                                {this.getStepSubButton(index)}
                                <Button
                                    disabled={!this.state.mnemonic}
                                    variant="contained"
                                    color="primary"
                                    onClick={this.handleNext}
                                    className={styles.stepBtn}
                                    size='small'
                                >
                                    {this.state.activeStep === this.steps.length - 1 ? '否' : '下一步'}
                                </Button>
                            </div>
                        </div>
                    }
                </div>
            </Container>
        );
    }
}
