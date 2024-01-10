const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
require('dotenv').config({path: "../.env"});
const {findUserInGoogleAuthAccounts} = require('./models/dataOperations');
const jwt = require('jsonwebtoken');

const config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET
};

const AUTH_OPTIONS = {
    callbackURL: "https://blogappbackend-cmom.onrender.com/user/auth/google/callback",
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
};

async function verifyCallback(accessToken, refreshToken, profile, done) {

    try
    {
        const {id, displayName, emails} = profile;
        const email = emails[0].value;
        
        const response = await findUserInGoogleAuthAccounts(displayName, id, email);
        if(response.message === 'Done')
        {
            const payload = response.result;
            const secret = process.env.JWT_SECRET;
            const options = { expiresIn: "1h" };
            const {username, id} = payload;
            const token = jwt.sign(payload, secret, options);
            profile.accessToken = token;
            profile.credentials = {username, id};
            done(null, profile);
        }
        else
        {
            console.log('Error', response.message);    
        }
    }
    catch(err)
    {
        console.log('Error', err.message);
    }
    
}
passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));
