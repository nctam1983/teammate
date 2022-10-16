import express from 'express';
import handleRegister from '../controller/handleRegister.js';
import handleLogin from '../controller/handleLogin.js';
import {
    checkAuthenticated,
    checkNotAuthenticated,
} from '../middleware/checkPassport.js';

const route = express.Router();

route.get('/register', (req, res) => {
    res.render('register');
});

route.post('/register', (req, res) => {
    handleRegister(req.body, result => {
        if (result != 'Done') {
            res.send(result);
        } else {
            res.render('login');
        }
    });
});

route.get('/login', (req, res) => {
    res.render('login');
});

route.post('/login', (req, res, next) => {
    handleLogin(req, res, next);
});

export default route;
