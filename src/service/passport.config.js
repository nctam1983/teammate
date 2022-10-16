import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';

const LocalStrategy = Strategy;

async function initialize(passport, getUserByUsername, getUserById) {
    const authenticateUser = async (username, password, done) => {
        const user = getUserByUsername(username);
        console.log(user);

        if (!user) {
            return done(null, false, { message: 'No user with that username' });
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (e) {
            return done(e);
        }
    };

    passport.use(new LocalStrategy(authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id));
    });
}

export default initialize;
