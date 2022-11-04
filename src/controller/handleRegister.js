import * as dotenv from 'dotenv';
dotenv.config();
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import AccountModel from '../model/accounts.js';
import sendMail from '../services/nodeMailer.js';

const handleRegister = async (account, done) => {
    try {
        const { username, password, email, displayname } = account;
        const id = uuidv4();

        let isUsername = await AccountModel.findOne({ username }).exec();
        if (isUsername) {
            return done('This username is used');
        }

        let isEmail = await AccountModel.findOne({ email }).exec();
        if (isEmail) {
            return done('This email is already in use by another account.');
        }
        
        const activeString = uuidv4();
        const secretKey = process.env.ACTIVE_TOKEN_SECRET;
        const activeToken = jwt.sign({activeString}, secretKey, {
            expiresIn: '1m'
        });
        const subject = `Hello ${username}, Welcome to Temmate!`;
        const html = `
                <p>You have signed up an account of Teammate successfully.</p>
                <p>Before loggin in and to use all the features of Teammate, you need to verify your account.</p>
                <a href="http://localhost:3000/user/verify/${id}/${activeToken}">
                    Click here to verify (NOTE: The link is only valid for 24 hours).
                </a>
                `;

        sendMail(email, subject, html);

        const user = {
            id,
            username,
            password,
            email,
            displayname,
            authority: 'user',
            active: false,
            activeString
        };

        await new AccountModel(user).save();
        return done('Done');
    } catch (error) {
        console.error(error);
    }
};

export default handleRegister;
