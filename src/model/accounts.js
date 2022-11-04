import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const schema = mongoose.Schema;
const AccountShema = new schema({
    id: {
        type: String,
        require: true,
        unique: true,
    },
    username: {
        type: String,
        require: true,
        unique: true,
        min: 8,
    },
    password: {
        type: String,
        require: true,
        min: 6,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    displayname: {
        type: String,
        require: true,
    },
    authority: {
        type: String,
        require: true,
        default: 'user',
    },
    active: {
        type: Boolean,
        require: true,
    },
    activeString: {
        type: String,
        require: true,
    },
});

AccountShema.pre('save', async function () {
    try {
        const saltRounds = 12;
        const hashedPasswork = await bcrypt
            .hash(this.password, saltRounds)
            .then(result => result);

        this.password = hashedPasswork;
    } catch (error) {
        console.error(error);
    }
});

AccountShema.methods.checkPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        console.error(error);
    }
};

const AccountModel = mongoose.model('accounts', AccountShema);

export default AccountModel;
