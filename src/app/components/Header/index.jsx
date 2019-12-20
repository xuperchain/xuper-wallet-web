/**
 * @file (index)
 */

import React from 'react';
import clsx from 'clsx';
import {withSnackbar} from 'notistack';

// material-ui
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ButtonBase from '@material-ui/core/ButtonBase';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import FileCopy from '@material-ui/icons/FileCopy';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// styles
import styles from './styles.less';
import Logo from '@public/images/logo.png';

const Header = props => {

    const [avatarEl, setAvatarEl] = React.useState(null);

    const handleClick = event => {
        setAvatarEl(event.currentTarget);
    };

    const handleClose = () => {
        setAvatarEl(null);
    };

    const [open, setOpen] = React.useState(false);

    const handleCloseDialog = () => {
        setOpen(false);
    };

    const clearCache = () => {
        props.clearWallet();
        setOpen(false);
    };

    function fallbackCopyTextToClipboard(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";  //avoid scrolling to bottom
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            props.enqueueSnackbar('复制完成', {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                        horizontal: 'center',
                }
            });
            console.log('Fallback: Copying text command was ' + msg);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }

    function copyTextToClipboard(text) {

        const copyEvent = e => {
            e.clipboardData.setData('text/plain', e.target.value);
            handleClose();
            document.removeEventListener('copy', copyEvent)
            e.preventDefault();
        };

        document.addEventListener('copy', copyEvent);

        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text);
            return;
        }

        if (window.clipboardData && window.clipboardData.setData) {
            // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
            return clipboardData.setData("Text", text);

        }

        navigator.clipboard.writeText(text).then(function () {
            props.enqueueSnackbar('复制完成', {
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
        }, function (err) {
            console.error('Async: Could not copy text: ', err);
        });
    }

    return (
        <Grid container style={props.style}
              className={
                  clsx(
                      styles.frame,
                      props.location.pathname !== '/' && styles.endFrame,
                      props.className
                  )
              }
              alignItems="center">
            <div className={styles.titleFrame}>
                <img src={Logo} className={styles.logo}/>
            </div>
            <Dialog
                fullWidth
                open={open}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">退出钱包</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        确认退出当前钱包账户么?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        取消
                    </Button>
                    <Button onClick={clearCache} color="primary" autoFocus>
                        确认
                    </Button>
                </DialogActions>
            </Dialog>
            {
                props.location.pathname.indexOf('/main') > -1 && (
                    <div className={clsx(styles.titleFrame, styles.rightTitleFrame)}>
                        <IconButton
                            className={clsx(styles.avatar, styles.user)}
                            aria-controls="avatar-menu"
                            onClick={handleClick}
                        >
                            <AccountCircleIcon/>
                        </IconButton>
                        <Menu
                            id="avatar-menu"
                            anchorEl={avatarEl}
                            keepMounted
                            open={!!avatarEl}
                            onClose={handleClose}
                        >
                            {
                                false && props.address && (
                                    <MenuItem onClick={() => copyTextToClipboard(props.address)}>
                                        <ListItemIcon>
                                            <FileCopy fontSize="small"/>
                                        </ListItemIcon>
                                        <ListItemText primary="复制地址"/>
                                    </MenuItem>
                                )
                            }
                            <MenuItem onClick={() => {
                                setOpen(true)
                            }}>
                                <ListItemIcon>
                                    <ExitToAppIcon fontSize="small"/>
                                </ListItemIcon>
                                <ListItemText primary="退出钱包"/>
                            </MenuItem>
                        </Menu>
                    </div>
                )
            }
        </Grid>
    )
}

export default withSnackbar(Header);
