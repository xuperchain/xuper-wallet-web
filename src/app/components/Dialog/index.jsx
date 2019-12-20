/**
 * @file (index)
 */

import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

// classes
import styles from './styles.less';
import Typography from "@material-ui/core/Typography";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default props => {
    return (
        <Dialog
            fullWidth
            open={props.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText variant="body2" id="alert-dialog-slide-description">
                    {props.content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {
                    props.handleResult ? (
                        <React.Fragment>
                            <Button autoFocus onClick={props.handleResult.bind(null, false)} color="primary">
                                取消
                            </Button>
                            <Button onClick={props.handleResult.bind(null, true)} color="primary">
                                确认
                            </Button>
                        </React.Fragment>
                    )
                        : (
                            <Button onClick={props.handleClose} color="primary">
                                关闭
                            </Button>
                        )
                }
            </DialogActions>
        </Dialog>
    );
}
