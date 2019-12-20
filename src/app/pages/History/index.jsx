/**
 * @file (index)
 */

import React, {useState} from 'react';
import clsx from 'clsx';
import BN from 'bn.js';

// material ui
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import DialogTemplate from '@components/Dialog';

import {tokenToCoin, format} from '@libs/utils';

// classes
import styles from './styles.less';

export default props => {

    const [showDialog, setShowDialog] = useState({
        show: false,
        info: null
    });

    const renderLastRow = () => {
        if (props.total === props.historyList.length) {
            return (
                <p>到底了</p>
            );
        }
        else {
            return (
                <p>正在获取中</p>
            )
        }
    };

    const renderRow = (props, index) => {

        let bnCurAmount = new BN(props.amount);
        let bnCurFee = new BN(props.fee);
        let bnCurSub = bnCurAmount.sub(bnCurFee);

        return (
            <ListItem key={index} className={styles.item}>
                <Grid container direction="column">
                    <Grid container justify="space-between" className={styles.filed}>
                        <Grid item>
                            <Typography>交易时间</Typography>
                        </Grid>
                        <Grid item>
                            <Typography align="right">{format(new Date(props['create_time'] * 1000), 'yyyy-MM-dd hh:mm')}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container justify="space-between" className={styles.filed}>
                        <Grid item>
                            <Typography noWrap>交易ID</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography noWrap variant="body2" align="right">{props.txid}</Typography>
                        </Grid>
                    </Grid>
                    {
                        props.desc && (
                            <Grid container justify="space-between" className={styles.filed}>
                                <Grid item>
                                    <Typography>交易描述</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography noWrap align="right">{props.desc}</Typography>
                                </Grid>
                            </Grid>
                        )
                    }
                    <Grid container justify="space-between" className={styles.filed}>
                        <Grid item>
                            <Typography>交易金额</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography
                                noWrap
                                align="right"
                                className={styles.amount}
                                color={props.tx_type === 2
                                    ? 'secondary'
                                    : 'primary'
                                }>
                                {props.tx_type === 2 ? '-': '+'}
                                &nbsp;
                                {tokenToCoin(
                                    props.tx_type === 2
                                        ? bnCurSub.toString(10)
                                        : bnCurAmount.toString(10)
                                    , 5
                                )}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item className={styles.filed}>
                        <Grid container justify="flex-end">
                            <Button variant="contained"
                                    size="small"
                                    color="primary"
                                    onClick={e => {
                                        setShowDialog({
                                            show: true,
                                            info: props
                                        });
                                    }}
                            >
                                详情
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </ListItem>
        )
    };

    let bnAmount = new BN(0);
    let bnFee = new BN(0);
    let bnSub = new BN(0);

    if (showDialog.show && showDialog.info && showDialog.info.amount) {
        bnAmount = new BN(showDialog.info.amount);
        bnFee = new BN(showDialog.info.fee);
        bnSub = bnAmount.sub(bnFee);
    }

    return props.historyList && props.historyList.length > 0 ? (
        <React.Fragment>
            <Typography component="p" className={styles.title}>交易记录</Typography>
            <Card className={styles.frame}>
                <CardContent>
                    <List className={styles.list}>
                        {props.historyList.map(renderRow)}
                    </List>
                </CardContent>
            </Card>
            <DialogTemplate
                open={showDialog.show}
                title="交易详情"
                content={
                    showDialog.info && (
                        <React.Fragment>
                            <Grid container justify="space-between" className={styles.filed}>
                                <Grid item>
                                    <Typography>交易时间</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography align="right">
                                        {
                                            format(new Date(showDialog.info['create_time'] * 1000),
                                                'yyyy-MM-dd hh:mm')
                                        }
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container justify="space-between" className={styles.filed}>
                                <Grid item>
                                    <Typography noWrap>交易ID</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography noWrap variant="body2" align="right">{showDialog.info.txid}</Typography>
                                </Grid>
                            </Grid>
                            {
                                showDialog.info['tx_outputs'].map(output => (
                                    <React.Fragment>
                                        <Grid container justify="space-between" className={styles.filed}>
                                            <Grid item>
                                                <Typography noWrap>转入账户</Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography variant="body2" align="right"  className={styles.wrap}>
                                                    {output['to_addr']}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container justify="space-between" className={styles.filed}>
                                            <Grid item>
                                                <Typography noWrap></Typography>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Typography color="primary" noWrap variant="body2" align="right">
                                                    {tokenToCoin(output['amount'], 5)}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </React.Fragment>
                                ))
                            }
                            {
                                showDialog.info['tx_inputs'].map(input => (
                                    <Grid container justify="space-between" className={styles.filed}>
                                        <Grid item>
                                            <Typography noWrap>转出账户</Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography variant="body2" align="right" className={styles.wrap}>
                                                {input['from_addr']}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                ))
                            }
                            <Grid container justify="space-between" className={styles.filed}>
                                <Grid item>
                                    <Typography>手续费</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography noWrap align="right">
                                        {tokenToCoin(showDialog.info.fee, 5)}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container justify="space-between" className={styles.filed}>
                                <Grid item>
                                    <Typography>交易金额</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography noWrap
                                                className={styles.amount}
                                                align="right"
                                                color={showDialog.info.tx_type === 2
                                                    ? 'secondary'
                                                    : 'primary'
                                                }>
                                        {showDialog.info.tx_type === 2 ? '-': '+'}
                                        &nbsp;
                                        {tokenToCoin(
                                            showDialog.info.tx_type === 2
                                                ? bnSub.toString(10)
                                                : bnAmount.toString(10)
                                            , 5
                                        )}
                                    </Typography>
                                </Grid>
                            </Grid>
                            {
                                showDialog.info.desc && (
                                    <Grid container justify="space-between" className={styles.filed}>
                                        <Grid item>
                                            <Typography>交易描述</Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Typography className={styles.wrap} align="right">{showDialog.info.desc}</Typography>
                                        </Grid>
                                    </Grid>
                                )
                            }
                        </React.Fragment>
                    )
                }
                handleClose={() => {
                    setShowDialog({
                        show: false,
                        info: null
                    })
                }}
            />
        </React.Fragment>
    ) : null;
}
