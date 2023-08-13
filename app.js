// Initializing the files
import express from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import cors from 'cors';


// experimenting with https secured


// setting the config files
import dotenv from 'dotenv'
dotenv.config();

app.use(cors({
    origin: "*",
}));

// Importing the DB Connection
import dbConnection from './db/connectDB.js';

const PORT = process.env.PORT || 3000;
(async () => {
    try {
        await dbConnection(process.env.MONGODB_URI);
        console.log("DB instance initialized and connected to!");
        app.listen(PORT, () => {
            console.log("Now, listening for Incoming Request!");
        })

    } catch (error) {
        console.log(error)
    }
})()


// initializing express middlewares
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// setting the view engine
app.set('view engine', 'ejs');


app.get("*", (req, res) => {
    res.status(404).render('404');
})
