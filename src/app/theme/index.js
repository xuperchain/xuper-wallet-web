/**
 * @file (index)
 */

import {createMuiTheme} from '@material-ui/core/styles';

const theme = createMuiTheme({
    // shadows: ["none"],
    palette: {
        primary: {
            main: '#08c3c8',
            contrastText: '#fff'
        },
        secondary: {
            main: '#FE9700',
            light: '#fef4e6'
        }
    },
    overrides: {
        MuiButton: {
            containedPrimary: {
            }
        }
    },
    custom: {
        appbar: {
            main: '#fff',
            contrastText: '#08c3c8'
        }
    }
});

export default theme;
