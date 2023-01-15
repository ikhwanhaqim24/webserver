const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    if (!req.body.username) {
        res.status(500).render("register", { error: {
            message: "Please input username",
            number: 500
        }})
        return;
    }
    if (!req.body.email) {
        res.status(500).render("register", { error: {
            message: "Please input email",
            number: 500
        }})
        return;
    }
    if (!req.body.password) {
        res.status(500).render("register", { error: {
            message: "Please input password",
            number: 500
        }})
        return;
    }
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    });

    user.save((err, user) => {
        if (err) {
            res.status(500).render("register", { error: {
                message: err,
                number: 500
            }})
            return;
        }

        if (req.body.roles) {
            Role.find({
                    name: {
                        $in: req.body.roles
                    },
                },
                (err, roles) => {
                    if (err) {
                        res.status(500).render("register", { error: {
                            message: err,
                            number: 500
                        }})
                        return;
                    }

                    user.roles = roles.map((role) => role._id);
                    user.save((err) => {
                        if (err) {
                            res.status(500).render("register", { error: {
                                message: err,
                                number: 500
                            }})
                            return;
                        }

                        res.status(200).render("register", {
                            success: {
                                message: "Registered successfully!"
                            }
                        })
                    });
                }
            );
        } else {
            Role.findOne({
                name: "user"
            }, (err, role) => {
                if (err) {
                    res.status(500).render("register", { error: {
                        message: err,
                        number: 500
                    }})
                    return;
                }

                user.roles = [role._id];
                user.save((err) => {
                    if (err) {
                        res.status(500).render("register", { error: {
                            message: err,
                            number: 500
                        }})
                        return;
                    }

                    res.status(200).render("register", {
                        success: {
                            message: "Registered successfully!"
                        }
                    })
                });
            });
        }
    });
};

exports.signin = (req, res) => {
    User.findOne({
            username: req.body.username,
        })
        .populate("roles", "-__v")
        .exec((err, user) => {
            if (err) {
                res.status(500).render("login", { error: {
                    message: err,
                    number: 500
                }})
                return;
            }

            if (!user) {
                return res.status(404).render("login", { error: {
                    message: "Username not found",
                    number: 404
                }})
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).render("login", { error: {
                    message: "Invalid Password",
                    number: 401
                }})
            }

            var token = jwt.sign({
                id: user.id
            }, config.secret, {
                expiresIn: 60 * 60 * 24, // 24 hours 86400
            });

            var authorities = [];

            for (let i = 0; i < user.roles.length; i++) {
                authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
            }

            req.session.token = token;
            req.session.loggedIn = true;
            
            var data = {    
                id: user._id,
                username: user.username,
                email: user.email,
                roles: authorities,
            }

            req.session.userData = data

            // res.status(200).send({
            //     id: user._id,
            //     username: user.username,
            //     email: user.email,
            //     roles: authorities,
            // });

            return res.redirect('/profile')
        });
};

exports.signout = async (req, res) => {
    try {
        req.session = null;
        return res.redirect('/');
    } catch (err) {
        this.next(err);
    }
};