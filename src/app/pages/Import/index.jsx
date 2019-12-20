/**
 * @file (index)
 */

import React from 'react';
import clsx from 'clsx';
import XuperSDK, {Language, Cryptography} from '@xuperchain/xuper-sdk';

// components
import Container from '@components/Container';

// material-ui
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

// styles
import styles from './styles.less';

export default props => {
    const [value, setValue] = React.useState('');
    const [failure, setFailure] = React.useState(false);

    const sdk = XuperSDK.getInstance();

    const retrieveWallet = async (value, save) => {
        if (value && value !== '' && sdk.checkMnemonic(value, Language.SimplifiedChinese)) {
            try {
                const wallet = await sdk.revertAccount(value, Language.SimplifiedChinese,
                    Cryptography.EccFIPS);
                props.changeValues({
                    wallet: wallet
                }, save);
                props.history.replace('/main');
            }
            catch (e) {
                throw e;
                setFailure(true);
            }
        }
        else {
            setFailure(true);
        }
    };

    return(
        <Container className={styles.frame}>
            <Grid container direction="column" className={styles.actionsArea}>
                <Grid item>
                    <Typography variant="h6" component="p">
                        请输入助记词
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body2" color="secondary">
                        助记词使用"空格"分隔
                    </Typography>
                </Grid>
                <Grid>
                    <TextField
                        error={failure}
                        className={styles.mnemonicField}
                        multiline
                        value={value}
                        onChange={e => {
                            if (failure) {
                                setFailure(false);
                            }
                            setValue(e.target.value);
                        }}/>
                </Grid>
                <Grid style={{
                    marginTop: 120
                }} className={styles.submitButtons}>
                    <Button className={clsx(styles.submitButton, styles.cacheBtn)}
                            variant="contained"
                            color="primary"
                            onClick={async () => retrieveWallet(value )}
                    >
                        导入钱包
                    </Button>
                    <Button className={styles.submitButton}
                            variant="contained"
                            color="primary"
                            onClick={async () => retrieveWallet(value, true)}
                    >
                        下次默认登录
                    </Button>
                    <Typography color="secondary">(本地存储具有安全风险)</Typography>
                </Grid>
            </Grid>
        </Container>
    )
}
