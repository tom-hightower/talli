const router = require('express').Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    // maybe this is where i send via socket.io?
    res.send('you have reached the redirect URI');

});

module.exports = router;