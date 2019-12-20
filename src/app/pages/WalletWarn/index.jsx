/**
 * @file (index)
 */

import React from 'react';
import clsx from 'clsx';

// components

// material-ui
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';

// classes
import styles from './styles.less';

export default props => {
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Card className={styles.frame}>
                <CardContent className={styles.cardContent}>
                    <Grid container alignItems="center" direction="column">
                        <Grid container alignItems="center" justify="space-between">
                            <Typography className={styles.text}>
                                未认证企业信息！认证成功方可转账
                            </Typography>
                            <ButtonBase style={{color: '#08c3c8'}} onClick={() => setOpen(true)}>
                                立刻认证
                            </ButtonBase>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Dialog open={open}
                    onClose={handleClose}
                    fullWidth
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">进入BaaS平台完成企业认证</DialogTitle>
                <DialogContent>
                    <DialogContentText className={styles.wordBreak} id="alert-dialog-description">
                        请在电脑上完成认证，成功方可转账！<br/><br/>
                        地址:<br/>
                        <a href="https://xchain.baidu.com/n/console#/encertify"
                           target="_blank"
                           style={{
                               wordBreak: 'break-word',
                               lineHeight: '1.5'
                           }}
                           rel="noopener">
                            https://xchain.baidu.com/n/console#/encertify
                        </a>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary"
                            onClick={handleClose}
                    >
                        确定
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
