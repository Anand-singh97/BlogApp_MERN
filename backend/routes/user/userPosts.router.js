const express = require('express');
 
const{createPost, showAllPosts, showPostDetails, updatePost} = require('../../controllers/user/userPosts.controller');
const {middlewareForJwtAuth} = require('../../controllers/user/userLoginRegister.controller');
const singleUpload = require('../../multer');

const postRouter = express.Router();
postRouter.get('/post', showAllPosts);
postRouter.post('/post', middlewareForJwtAuth, singleUpload, createPost);
postRouter.put('/updatePost',middlewareForJwtAuth, singleUpload, updatePost);
postRouter.get('/details/:id', middlewareForJwtAuth, showPostDetails);
module.exports = postRouter;
