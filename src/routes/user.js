import express from 'express';
import handleRegister from '../controller/handleRegister.js';
import handleLogin from '../controller/handleLogin.js';
import verifyAccount from '../controller/verifyAccount.js';
import handleLogOut from '../controller/handleLogOut.js';
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
            res.redirect('login');
        }
    });
});

route.get('/login', (req, res) => {
    res.render('login');
});

route.post('/login', (req, res, next) => {
    handleLogin(req, res, next);
});

route.get('/verify/:id/:activeString', (req, res) => {
    const { id, activeString } = req.params;
    verifyAccount(id, activeString);
    res.send('200')
});

route.post('/logout', (req, res) => {  
    handleLogOut(req, res)
});

export default route;
