import * as dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import { fileURLToPath } from 'url';
import path from 'path';
import { readFileSync } from 'fs';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import flash from 'express-flash';
// import connection from './service/mongoDB.connection.js';

import authenticateBearerToken from './middleware/jwt.authentication.js';
import { checkAuthenticated } from './middleware/checkPassport.js';

const app = express();
const server = http.Server(app);

const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);

mongoose
    .connect('mongodb://127.0.0.1:27017/teammate')
    .then(result => console.log('Connected to database sucessfully <3'))
    .catch(error => console.log('Failure to connect database!'));

mongoose.connection.on('error', err => console.log(err.message));
mongoose.connection.on('disconnected', () => {
    console.log('Mongodb is disconnected!');
});

global.__dirname = _dirname;
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 2,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());


const port = process.env.PORT || 3000;

import userRoute from './routes/user.js';
app.use('/user', userRoute);

app.get('/html/:page', (req, res) => {
    let __path = __dirname + '/views/' + req.params.page + '.html';
    let html = readFileSync(__path, { encoding: 'utf-8' });

    res.json(html);
});

app.get('/passport', (req, res) => {
    res.send('passport');
});

app.get('/*', checkAuthenticated, (req, res) => {
    res.render('index');
});

server.listen(3000, () => {
    console.log('Server starting on port ' + port);
});
