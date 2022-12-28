exports.allAccess = (req, res) => {
    return res.status(200).send("This is a public content.");
};

exports.userBoard = (req, res) => {
    return res.status(200).render("userprofile", { access : "user", userData: req.session.userData });
};

exports.adminBoard = (req, res) => {
    return res.status(200).render("userprofile", { access : "admin", userData: req.session.userData });
};

exports.moderatorBoard = (req, res) => {
    return res.status(200).render("userprofile", { access : "moderator", userData: req.session.userData });
};

exports.testBoard = (req,res) => {
    var userData = req.session.userData
    var modSession = "FALSE"
    var adminSession = "FALSE"

    if (userData) {
        modSession = (userData.roles.includes("ROLE_MODERATOR") ? "TRUE" : "FALSE")
        adminSession = (userData.roles.includes("ROLE_MODERATOR") ? "TRUE" : "FALSE")
    } else {
        userData = {
            username: "Guest"
        }
    }
    var apiData = [{
        route: "/public",
        minPerm: "ALL",
        currentSession: "TRUE"
    }, {
        route: "/profile",
        minPerm: "USER",
        currentSession: (req.session.loggedIn ? "TRUE" : "FALSE")
    }, {
        route: "/mod",
        minPerm: "MODERATOR",
        currentSession: modSession
    }, {
        route: "/admin",
        minPerm: "ADMIN",
        currentSession: adminSession
    }]

    return res.status(200).render("apiPage", { apiData: apiData, userData: userData })
}