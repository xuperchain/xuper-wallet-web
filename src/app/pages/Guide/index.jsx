/**
 * @file (index)
 */

import React from 'react';
import clsx from 'clsx';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import styles from './styles.less';
import Logo from '@public/images/logo_big.png';

export default class Guide extends React.Component {
    render() {
        return (
            <Grid container className={clsx(styles.frame, this.props.className)}>
                <img className={styles.bigLogo} src={Logo}/>
                {
                    this.props.available
                        ? (
                            <React.Fragment>
                                <Link to="/create">
                                    <Button variant="contained"
                                            color="primary"
                                            className={styles.btnFrame}>
                                        创建新钱包
                                    </Button>
                                </Link>
                                <Link to="/import">
                                    <Button variant="contained"
                                            color="primary"
                                            className={styles.btnFrame}>
                                        导入钱包
                                    </Button>
                                </Link>
                            </React.Fragment>
                        )
                        : (
                            <React.Fragment>
                                <Typography gutterBottom align="center">
                                    抱歉，暂时不支持该浏览器，请使用Chrome(或其他支持WebAssembly)浏览器访问
                                </Typography>
                            </React.Fragment>
                        )
                }
            </Grid>
        );
    }
}
