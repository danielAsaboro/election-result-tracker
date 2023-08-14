// Initializing the files
import "express-async-errors";

import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";

// experimenting with https secured

// setting the config files
import dotenv from "dotenv";
dotenv.config();
// Importing the DB Connection
import dbConnection from "./db/connectDB.js";

// Error handlers
import notFound from "./middleware/not-found.js";
import errorHandler from "./middleware/error-handler.js";

// Router
import authRouter from "./routes/auth.js";

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Election Result Tracker Api");
});

// ?route
app.use("/api/v1/auth", authRouter);

// initializing express middlewares
app.use(notFound);
app.use(errorHandler);

// Middleware
// setting the view engine
app.set("view engine", "ejs");

app.get("*", (req, res) => {
  res.status(404).render("404");
});

const PORT = process.env.PORT || 3000;
(async () => {
  try {
    await dbConnection(process.env.MONGO_URI);
    console.log("DB instance initialized and connected to!");
    app.listen(PORT, () => {
      console.log("Now, listening for Incoming Request!");
    });
  } catch (error) {
    console.log(error);
  }
})();
