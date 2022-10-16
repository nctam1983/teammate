import * as dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import AccountModel from '../model/accounts.js';

const authenticateBearerToken = (req, res, next) => {
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const errorMessage =
        'You do not have permission to access this page. ' +
        'Plaese sign in or contact your administrator to get permission to access this page.';

    if (!token) return res.status(401).send(errorMessage);
    jwt.verify(token, secretKey, async (error, data) => {
        if (error) return res.status(403).send(errorMessage);

        const isUser = await AccountModel.findOne({ id: data }).exec();

        if (isUser) {
            req.user = {
                id: isUser.id,
                username: isUser.username,
            };
        } else {
            req.user = null;
        }
        next();
    });
};

export default authenticateBearerToken;
