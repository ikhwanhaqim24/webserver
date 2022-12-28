const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");

const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

app.set("view engine","ejs");

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
    cookieSession({
    name: "bezkoder-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true
    })
);

const db = require("./app/models");
const dbConfig = require("./app/config/db.config");

db.mongoose
    .set('strictQuery', true)
    .connect(dbConfig.PATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    })
    .then(() => {
    console.log("Successfully connect to MongoDB.");
    db.init(db.role);
    })
    .catch(err => {
    console.error("Connection error", err);
    process.exit();
    });

// simple route
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});