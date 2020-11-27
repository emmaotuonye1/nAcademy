// const Instructor = require("../models/instructorsModel");
module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if(req.isAuthenticated()) {
            return next();
        } else {
            req.flash("error_msg", "Log in Please");
            res.redirect("/auth/login");
        }
    },
    verifyPermission: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.flash("error_msg", "Admin Prevelages are Required");
            res.redirect("/admin/login");
        }
    },
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/login');
        }
    }
}