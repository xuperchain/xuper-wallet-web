/**
 * @file (index)
 */

import React from 'react';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// classes
import styles from './styles.less';

export default props => {
    const [value, setValue] = React.useState(props.conf && !!props.conf.node || 'default');
    const [node, setNode] = React.useState(props.conf && props.conf.node);

    const handleChange = event => {
        setValue(event.target.value);
    };

    // Todo: 获取、设置节点状态

    return (
        <Paper>
            <Grid container direction="column" style={{padding: 16}}>
                <Grid item>
                    <Typography variant="h6" style={{lineHeight: 1.15}}>设置节点</Typography>
                </Grid>
                <Grid item>
                    <RadioGroup aria-label="gender" name="gender1" style={{padding: 16}}
                                value={value} onChange={handleChange}>
                        <FormControlLabel value="default" control={<Radio />} label="使用推荐节点" />
                        <FormControlLabel value="custom" control={<Radio />} label="使用自定义节点" />
                    </RadioGroup>
                </Grid>
                {
                    value === 'custom' && (
                        <Grid item style={{padding: 16}}>
                            <TextField value={node} onChange={e => {
                                setNode(e.target.value)
                            }}/>
                            <Button onClick={props.changeValues({
                                node: value
                            }, true)}>确认</Button>
                        </Grid>
                    )
                }
            </Grid>
        </Paper>
    )
}
