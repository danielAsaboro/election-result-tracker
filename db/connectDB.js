import mongoose from 'mongoose';

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

const dbConnection = (url) => mongoose.connect(url, options);
export default dbConnection;

