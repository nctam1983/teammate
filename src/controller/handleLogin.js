import * as dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import passport from 'passport';
import AccountModel from '../model/accounts.js';
import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';

const handleLogin = (req, res, next) => {
    const LocalStrategy = Strategy;
    const authenticateUser = async (username, password, done) => {
        const user = await AccountModel.findOne({ username }).exec();

        if (!user) {
            return done(null, false, {
                type: 'error',
                field: 'username',
                message: `'${username}' not found`,
            });
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user, {
                    type: 'info',
                    path: '/',
                    message: 'Successfully! Valid user',
                });
            } else {
                return done(null, false, {
                    type: 'error',
                    field: 'password',
                    message: 'Incorrect password ',
                });
            }
        } catch (e) {
            return done(e);
        }
    };

    passport.use(new LocalStrategy(authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        const user = await AccountModel.findOne({ id }).exec();
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
    return passport.authenticate('local', (error, user, info) => {
        if (error) {
            console.error(error);
            return res.sendStatus(500);
        }
        if (!user && info.field === 'password') return res.json(info);
        if (!user && info.field === 'username') return res.json(info);
        try {
            req.logIn(user, async err => {
                if (err) return console.error(err);
                const accessKey = process.env.ACCESS_TOKEN_SECRET;
                const accessToken = await jwt.sign({ id: user.id }, accessKey, {
                    expiresIn: '2h',
                });

                const refreshKey = process.env.REFRESH_TOKEN_SECRET;
                const refreshToken = await jwt.sign(
                    { id: user.id, authority: user.authority },
                    refreshKey,
                    {
                        expiresIn: '3d',
                    }
                );

                res.cookie('accessToken', accessToken);
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                });
                res.status(200).json(info);
            });
        } catch (err) {
            console.error(err);
        }
    })(req, res, next);
};

export default handleLogin;
