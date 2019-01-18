import { createMuiTheme } from '@material-ui/core/styles';
import { lightBlue, green } from '@material-ui/core/colors';

/**
 * Check out https://material-ui.com/customization/themes/ to
 * learn how theming works in Material UI.  I set up this basic
 * theme to use colors similar to our logo colors, but this can
 * be changed easily later
 */
export default createMuiTheme({
    palette: {
        primary: lightBlue,
        secondary: green 
    }
});
