import { createMuiTheme } from '@material-ui/core/styles';
import { lightBlue, green, red } from '@material-ui/core/colors';

/**
 * Check out https://material-ui.com/customization/themes/ to
 * learn how theming works in Material UI.  I set up this basic
 * theme to use colors similar to our logo colors, but this can
 * be changed easily later
 */
export default createMuiTheme({
    palette: {
        primary: lightBlue,
        secondary: green,
        error: red
    },
    typography: {
        h4: {
            fontWeight: 500,
            fontSize: 30,
        },
        h5: {
            fontSize: 25,
        }
    },
    overrides: {
        MuiButton: {
            raisedPrimary: {
                color: 'white',
            },
        },
    }
});
