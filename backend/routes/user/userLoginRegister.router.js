const express = require('express');
const router = express.Router();
const {
    getUserNameAndPassword,
    googleLoginPopup,
    exchangeAuthCodeWithAccessToken,
    checkUserNameAndPassword,
    middlewareForJwtAuth,
    logoutUser
} = require('../../controllers/user/userLoginRegister.controller');

router.post('/register', getUserNameAndPassword);
router.post('/login', checkUserNameAndPassword);
router.get('/auth/google', googleLoginPopup);
router.get('/auth/google/callback', exchangeAuthCodeWithAccessToken);
router.get('/logout', logoutUser)
router.get('/auth', middlewareForJwtAuth, (req, res) => {
    res.status(200).send('Authenticated');
});

module.exports = router;
