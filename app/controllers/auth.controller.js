const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    });

    user.save((err, user) => {
        if (err) {
            res.status(500).render("error", { error: {
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
                        res.status(500).render("error", { error: {
                            message: err,
                            number: 500
                        }})
                        return;
                    }

                    user.roles = roles.map((role) => role._id);
                    user.save((err) => {
                        if (err) {
                            res.status(500).render("error", { error: {
                                message: err,
                                number: 500
                            }})
                            return;
                        }

                        res.send({
                            message: "User was registered successfully!"
                        });
                    });
                }
            );
        } else {
            Role.findOne({
                name: "user"
            }, (err, role) => {
                if (err) {
                    res.status(500).render("error", { error: {
                        message: err,
                        number: 500
                    }})
                    return;
                }

                user.roles = [role._id];
                user.save((err) => {
                    if (err) {
                        res.status(500).render("error", { error: {
                            message: err,
                            number: 500
                        }})
                        return;
                    }

                    res.send({
                        message: "User was registered successfully!"
                    });
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
                res.status(500).render("error", { error: {
                    message: err,
                    number: 500
                }})
                return;
            }

            if (!user) {
                return res.status(404).render("error", { error: {
                    message: "User not found",
                    number: 404
                }})
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).render("error", { error: {
                    message: "Invalid Password",
                    number: 401
                }})
            }

            var token = jwt.sign({
                id: user.id
            }, config.secret, {
                expiresIn: 86400, // 24 hours
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