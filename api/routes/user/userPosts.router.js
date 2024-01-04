const express = require('express');
const multer = require('multer');
const uploadMiddleware = multer({dest:'uploads/'});
const{createPost, showAllPosts, showPostDetails, updatePost} = require('../../controllers/user/userPosts.controller');
const {middlewareForJwtAuth} = require('../../controllers/user/userLoginRegister.controller');

const postRouter = express.Router();
postRouter.get('/post', middlewareForJwtAuth, showAllPosts);
postRouter.post('/post', middlewareForJwtAuth, uploadMiddleware.single('imageFile'), createPost);
postRouter.put('/updatePost',middlewareForJwtAuth, uploadMiddleware.single('imageFile'), updatePost);
postRouter.get('/details/:id', middlewareForJwtAuth, showPostDetails);
module.exports = postRouter;
