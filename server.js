const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");

require('dotenv').config()

const app = express();

var corsOptions = {
    origin: "http://localhost:8080"
};

app.set("view engine","ejs");

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
    cookieSession({
    name: "onetimepad-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true
    })
);

const db = require("./app/models");
const dbConfig = require("./app/config/db.config");

const initDB = async () => {
    db.mongoose
    .set('strictQuery', true)
    .connect(dbConfig.PATH, dbConfig.mongoOptions)
    .then(() => {
    console.log(`Successfully connect to MongoDB (${process.env.ENABLEATLAS === 'true' ? "Atlas" : `Remote Server: ${process.env.DBHOST}`})`);
    db.init(db.role);
    })
    .catch(err => {
    console.error("Connection error", err);
    process.exit();
    });
}

// simple route
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.WEBPORT || 8080;
const HOST = process.env.WEBHOST || "127.0.0.1"
app.listen(PORT, HOST, () => {
    console.log(`Server RUNNING on ${HOST}:${PORT}`);
    initDB()
});