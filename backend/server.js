const fs = require('fs');
const cloudinary = require('cloudinary');
const cors = require('cors');
const path = require('path');
const https = require('https');
const helmet = require('helmet');
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: './.env' });
require('./passportConfig');

const userRoutes = require('./routes/user/userLoginRegister.router');
const postRouter = require('./routes/user/userPosts.router');

const config = { 
    MONGO_URL: process.env.MONGO_URL,
    CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUD_API_KEY: process.env.CLOUD_API_KEY,
    CLOUD_SECRET: process.env.CLOUD_SECRET
 };
const app = express();
const PORT = process.env.PORT || 8000;

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:true})); 
cloudinary.v2.config({
    cloud_name: config.CLOUD_NAME,
    api_key: config.CLOUD_API_KEY,
    api_secret: config.CLOUD_SECRET
});
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(passport.initialize());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {console.log(__dirname);res.setHeader('Cross-Origin-Resource-Policy', 'same-site');},
}));
app.use('/user', userRoutes);
app.use('/posts', postRouter); 

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (error) => {
    console.error(error);
});

const server = https.createServer(
    { key: fs.readFileSync('key.pem'), cert: fs.readFileSync('cert.pem') },
    app
);

async function startServer() {
    await mongoose.connect(config.MONGO_URL);
    server.listen(PORT, () => {
        console.log(`Listening on ${PORT}...`);
    });
}

startServer();
