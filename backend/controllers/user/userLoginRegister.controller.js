const passport = require("passport");
const CLIENT_URL = "https://super-scone-037dbb.netlify.app";
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../../.env" });

async function middlewareForJwtAuth(req, res, next) {
    try
    {
        const token =  req.cookies.token;
        if(!token) return res.status(401).json({message:'unauthorized'});
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decode.id;
        req.authorType = decode.authorType;
        next();
    }
    catch(error)
    {
        return res.status(401).json({message:'unauthorized'});
    }  
}
const {
  saveDataInRegisteredAccounts,
  findUserInRegisteredAccounts,
} = require("../../models/dataOperations");

async function getUserNameAndPassword(req, res) {

    try {
        const { username, password } = req.body;
        const response = await saveDataInRegisteredAccounts(username, password);
        if (response.message === "Done") {
            const { result } = response;
            const payload = {...result, authorType:'registered_accounts'};
            const {username, id} = payload;
            const secret = process.env.JWT_SECRET;
            const options = { expiresIn: "1h" };
            const jwtToken = jwt.sign(payload, secret, options);
            res
            .cookie("token", jwtToken, {
                httpOnly: true,
                secure:true, 
                maxAge:  3600000
            }).json({username:username, id:id});
        } 
        else 
        {
            return res.status(503).json({ message: response.message });
        }
    } 
    catch (error)
    {
        return res.status(401).json({ message: error.message });
    }
}
async function checkUserNameAndPassword(req, res) {
    try 
    {
        const { username, password } = req.body;
        const response = await findUserInRegisteredAccounts(username, password);
        if (response.message === "Done") {
            const { result } = response;
            const payload = {...result, authorType:'registered_accounts'};
            const {username, id} = payload;
            const secret = process.env.JWT_SECRET;
            const options = { expiresIn: "1h" };
            const jwtToken = jwt.sign(payload, secret, options);
            res
            .cookie("token", jwtToken, {
                httpOnly: true,
                secure:true, 
                maxAge: 3600000
            }).json({username:username, id:id});
        } 
        else 
        {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
}
function googleLoginPopup(req, res, next) {

  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
}
function exchangeAuthCodeWithAccessToken(req, res, next) {
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/failure",
    session: false,
  }, 
  async function(error, user)
  {
    const jwtToken = user.accessToken;
    const {username, id} = user.credentials;
    res
            .cookie("token", jwtToken, {
                httpOnly: true,
                secure:true, 
                maxAge: 3600000
            }).json({username:username, id:id})
            
            next();
  })(req, res, next);
}
function logoutUser(req, res){
    try {
        res.clearCookie('token', {
          httpOnly: true,
          secure: true,
        }).status(204).end(); // Use status code 204 to indicate successful action without content
      } catch (error) {
        res.status(500).json({ message: error.message }); // Consider using 500 Internal Server Error for server errors
      }
}

module.exports = {
    getUserNameAndPassword,
    googleLoginPopup,
    exchangeAuthCodeWithAccessToken,
    checkUserNameAndPassword,
    middlewareForJwtAuth,
    logoutUser
};
