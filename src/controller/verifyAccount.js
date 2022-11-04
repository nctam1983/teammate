import * as dotenv from 'dotenv';
dotenv.config();
import jwt from "jsonwebtoken";
import AccountModel from "../model/accounts.js";
import sendMail from '../services/nodeMailer.js';

const verifyAccount = async (id, token) => {
    try {
        let isUser = await AccountModel.findOne({id}).exec();
        if (!isUser) return console.error('Not found user with id: ' + id);

        const secret = process.env.ACTIVE_TOKEN_SECRET;
        jwt.verify(token, secret, async (error, decode) => {
            if (error) {
                const refreshActiveToken = jwt.sign({activeString: isUser.activeString}, secret, {
                    expiresIn: '24h'
                });
                const htmlSendedByMail = `
                    <p>Your token has expired.</p>
                    <a href="http://localhost:3000/user/verify/${isUser.id}/${refreshActiveToken}">
                        Here is new verification code (NOTE: The code is only valid for 24 hours).
                    </a>
                `;
                return sendMail(isUser.email, 'Refresh verification code', htmlSendedByMail);
            }
            
            const activeString = decode.activeString;            
            let isValid = isUser.activeString === activeString;
            if (isValid) {
                await AccountModel.findOneAndUpdate({
                    id,
                    activeString
                }, {
                    $set: {active: true}
                })
                return;
            }

        });

    } catch (e) {
        console.error(e)
    }
}

export default verifyAccount;
