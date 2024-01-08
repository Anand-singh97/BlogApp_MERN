const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    username:{
        type:String, 
        required:true,
        min:4,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:4
    }
});
const google_user_schema = new mongoose.Schema({

    username:{
        type:String,
    },
    googleAccountId:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    }
});
const postsSchema = new mongoose.Schema({
    title:String,
    summary:String,
    content:String,
    imageLocation:{
        id:{type:String},
        url:{type:String}
    },
    author:{type:Schema.Types.ObjectId, refPath:'authorType'},
    authorType:{type:String, enum:['registered_accounts', 'google_oauth_accounts']}
}, {timestamps:true});

const userCollection = mongoose.model('registered_accounts', userSchema);
const googleUserModel = mongoose.model('google_oauth_accounts', google_user_schema);
const postsModel = mongoose.model('posts', postsSchema);

module.exports = {
    userCollection,
    googleUserModel,
    postsModel
}