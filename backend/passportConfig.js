const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
require('dotenv').config({path: "../.env"});
const {findUserInGoogleAuthAccounts} = require('./models/dataOperations');

const config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET
};

const AUTH_OPTIONS = {
    callbackURL: "/auth/google/callback",
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
