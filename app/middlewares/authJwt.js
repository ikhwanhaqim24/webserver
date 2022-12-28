const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyLoggedIn = (req, res, next) => {
    let loggedIn = req.session.loggedIn;

    if (loggedIn) return res.status(200).redirect('/profile')
    next()
}

verifyToken = (req, res, next) => {
    let token = req.session.token;

    if (!token) {
        return res.status(403).render("error", { error: {
            message: "No token provided!",
            number: 403
        }})
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).render("error", { error: {
                message: "Unauthorized!",
                number: 401
            }})
        }
        req.userId = decoded.id;
        next();
    });
};

isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).render("error", { error: {
                message: err,
                number: 500
            }})
            return;
        }

        Role.find({
                _id: {
                    $in: user.roles
                },
            },
            (err, roles) => {
                if (err) {
                    res.status(500).render("error", { error: {
                        message: err,
                        number: 500
                    }})
                    return;
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "admin") {
                        next();
                        return;
                    }
                }

                res.status(403).render("error", { error: {
                    message: "Require admin role!",
                    number: 403
                }})
                return;
            }
        );
    });
};

isModerator = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).render("error", { error: {
                message: err,
                number: 500
            }})
            return;
        }

        Role.find({
                _id: {
                    $in: user.roles
                },
            },
            (err, roles) => {
                if (err) {
                    res.status(500).render("error", { error: {
                        message: err,
                        number: 500
                    }})
                    return;
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "moderator") {
                        next();
                        return;
                    }
                }

                res.status(403).render("error", { error: {
                    message: "Require moderator role!",
                    number: 403
                }})
                return;
            }
        );
    });
};

const authJwt = {
    verifyLoggedIn,
    verifyToken,
    isAdmin,
    isModerator,
};
module.exports = authJwt;