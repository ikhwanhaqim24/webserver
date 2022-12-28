const {
    authJwt
} = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/", (req, res) => {
        res.render("home", { loggedIn: req.session.loggedIn })
    });
    
    app.get("/login", [authJwt.verifyLoggedIn], (req, res) => {
        res.render("login")
    });

    app.get("/register", [authJwt.verifyLoggedIn], (req, res) => {
        res.render("register")
    });

    app.get(["/api/test/all", "/public", "/all"], controller.allAccess);

    app.get(["/api/test"], controller.testBoard);

    app.get(["/api/test/user", "/profile"], [authJwt.verifyToken], controller.userBoard);

    app.get(
        ["/api/test/mod", "/mod"],
        [authJwt.verifyToken, authJwt.isModerator],
        controller.moderatorBoard
    );

    app.get(
        ["/api/test/admin", "/admin"],
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard
    );
};