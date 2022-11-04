// import * as dotenv from 'dotenv';
// dotenv.config();
import mongoose from 'mongoose';

const url = process.env.MONGODB_URL || 'mongodb://localhost:27017/teammate';
const connection = mongoose.createConnection(url, {
    useNewUrlParser: true,
});

connection.on('connected', function () {
    console.log(`Connected to ${this.name} mongo database`);
});

connection.on('error', function (error) {
    console.log(`Failure to connect mongo database`);
    console.log(`With error: ${JSON.stringify(error)}`);
});

connection.on('disconnected', function () {
    console.log(`Disconnected to ${this.name} mongo database`);
});

process.on('SIGINT', async () => {
    await connection.close();
    process.exit(0);
});

export default connection;
