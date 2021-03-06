const bcrypt = require("bcryptjs");
const passport = require("passport");
const {Instructor} = require("../../models/instructor/instructor");
const randomString = require("randomstring");

module.exports = {
    registerGet: (req, res) => {
        const pagetitle = "Register";
        res.render("auth/register", {pagetitle});
    },

    registerPost: async (req, res) => {
            const { name, email, phone, password, confirmPassword, instructorApproved, skills, experience} = req.body;
            const instructorAvatar = req.file
            console.log(req.body);
        let errors = [];

        // CHECKING REQUIRED FIELD
        if (!name || !email || !phone || !password || !confirmPassword) {
            errors.push({ msg: "Please fill in all fields" });
        }

        // CHECKING PASSWORD MATCH
        if (password !== confirmPassword) {
            errors.push({ msg: "Passwords do not match" });
        }

        //CHECKING PASSWORD LENGHT
        if (password.length < 4) {
            errors.push({ msg: "Password must be atleast 3 Characters" });
        }

        if (errors.length > 0) {
            let pagetitle = "Register";
            res.render("auth/register", {
                errors,
                name,
                email,
                phone,
                password,
                confirmPassword,
                pagetitle
            });
        } else {
            await Instructor.findOne({email: email})
            .then(async(instructor) => {
                if(instructor) {
                    // console.log("Sorry User already Exist ");
                    return res.redirect("/auth/register");
                } else {
                    const instructorId = `nInst-${randomString.generate({
                        lenght: 5,
                        charset: "alphanumeric"
                    })}`
                    const newInstructor = await new Instructor ({
                        name,
                        email,
                        phone,
                        instructorAvatar,
                        skills: [],
                        experience: [],
                        password,
                        instructorId
                    })



                    // console.log(`New instructor created: ${newInstructor}`);

                    // HASHING PASSWORD
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newInstructor.password, salt, (err, hash) => {
                            if (err) throw err;
                        
                            // SETTING PASSWORD TO HASH
                            newInstructor.password = hash;
                            // SAVING USER
                            newInstructor
                                .save()
                                .then((instructor) => {
                                    req.flash(
                                        "success_msg",
                                        "Registration succesfull, You can now log in"
                                    );
                                    // console.log(`Reg successfull ${instructor}`);
                                    res.redirect("/auth/login");
                                })
                                .catch((err) => console.log(err));
                        })
                    );
                }
            })
        }
    },

    loginGet: (req, res) => {
        const pagetitle = "Login";
        res.render("auth/login", {pagetitle});
    },

    loginPost: (req, res, next) => {
        passport.authenticate("instructor", {
            successRedirect: "/instructor/profile",
            failureRedirect: "/auth/login",
            failureFlash: true,
        })(req, res, next);
    },

    logout: (req, res) => {
        req.logOut();
        req.flash({message:"You are logged out"});
        res.redirect("/auth/login")
    },
    // Instructor_updateGet: (req, res) => {
    //     const pagetitle = "Profile";
    //     res.render("instructor/profile", {pagetitle});
    // },
    // Instructor_updatePost: async (req, res) => {
    //     if(!req.body) {
    //         req.flash("error_msg", "Please fill in the form");
    //     } else {
    //         await Instructor.findOneAndUpdate(req.body, (err, data) => {
    //             if(err) {
    //                 return err;
    //             } else {
    //                 req.flash("success_msg", "Status Updated successfully");
    //                 // console.log(`Updated ${data} successfully!`);
    //                 res.redirect("/instructor/profile");
    //             }
    //         })
    //     }
    // }
}

// LOGOUT HANDLE

// router.get("/logout", (req, res) => {
//     req.logOut();
//     req.flash("success_msg", "You are logged out");
//     res.redirect("/users/login");
//   });