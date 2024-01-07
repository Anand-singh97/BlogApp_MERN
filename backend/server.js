const fs = require('fs');
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

const config = { MONGO_URL: process.env.MONGO_URL };
const app = express();
const PORT = 8000;

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:true})); 
app.use(cookieParser());
app.use(cors({ origin: 'https://localhost:3000', credentials: true }));
app.use(passport.initialize());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {res.setHeader('Cross-Origin-Resource-Policy', 'same-site');},
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
