import AccountModel from '../model/accounts.js';
import { v4 as uuidv4 } from 'uuid';

const Register = async (account, done) => {
    try {
        const { username, password, email, displayname } = account;
        let isEmail = await AccountModel.findOne({ email }).exec();
        let isUsername = await AccountModel.findOne({ username }).exec();

        if (isEmail) {
            return done('This email is already in use by another account.');
        }
        if (isUsername) {
            return done('This username is used');
        }

        const user = {
            id: uuidv4(),
            username,
            password,
            email,
            displayname,
            authority: 'user',
        };
        await new AccountModel(user).save();
        return done('Done');
    } catch (error) {
        console.error(error);
    }
};

export default Register;
