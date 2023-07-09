const express = require("express");
const sessionRouter = express.Router();
const { userModel } = require('../manager/dao/models/users_model');
const { auth, getUserInfo } = require("../utils/middleware/get_user_info");
const { createHash } = require("../utils/helpers/hasher");
const { checkValidPassword } = require("../utils/helpers/pwd_validator");
const passport = require("passport");
const { generateToken, authToken } = require("../utils/helpers/jsonwebtoken");
const { authorization } = require("../passport-jwt/authorization_middleware.js");


const jwt = require("jsonwebtoken");
// const { setUserInfo } = require("../utils/middleware/set_user_info_middleware");

// const users = [];

sessionRouter.get("/", (req, res) => {
    res.render("login", {});
});

// sessionRouter.get("/", (req, res) => {
//     res.sender("")
// });



sessionRouter.post("/", 
    // authorization("admin"),
    passport.authenticate("login", {
        failureRedirect: "/error-login"}), async (req, res) => {
            const { email, password } = req.body;

        // if (email !== "jorge@gmail.com" || password !== "pwd") {
        //     return res.status(401).send({
        //         status: "error",
        //         message: "invalid cred"
        //     })
        // }

        let user_info = ({...req.user}._doc);
        delete user_info._id; delete user_info.password; delete user_info.__v;
        user_info = { ...user_info, full_name: `${user_info.first_name} ${user_info.last_name}`};
        req.session.user_info = user_info;

        let token = jwt.sign({email, password}, 'Coder$ecret', {expiresIn: '24h'});

        res.cookie("coderCookieToken", token, {
            maxAge: 60*60*1000*24,
            httpOnly: true
        }).redirect("/api/products");
    }
);

sessionRouter.get("/error-login", async (req, res) => {
    const failureMessage = req.session?.messages ? req.session.messages[0] : "Error desconocido al iniciar sesión";
    // console.log(req.session.messages);
    res.render("login_error", {failureMessage});
    delete req.session.messages;
})



sessionRouter.get("/current", authToken, (req, res) => {
    res.send({
        status: "success",
        payload: req.user
    })
});



sessionRouter.get("/register", (req, res) => {
    res.render("register", {});
});

sessionRouter.post("/register", 
    passport.authenticate("register", {
        failureRedirect: "/failregister",
    }), async (req, res) => {
        res.redirect("/success-register")
    }
);

sessionRouter.get("/success-register", (req, res) => {
    let user_info = {};
    let register_success = false;
    if (req.user) {      
        user_info = { 
            ...user_info, 
            first_name: req.user.first_name,
            username: req.user.username,
            email: req.user.email,
        }
        register_success = true;
    }
    res.render("register_success", {user_info, register_success});
});

sessionRouter.get("/failregister", (req, res) => {
    const failureMessage = req.session?.messages ? req.session.messages[0] : "Error desconocido al registrar el usuario";
    console.log(req.session.messages);
    res.render("register_error", {failureMessage});
    delete req.session.messages;
});


sessionRouter.get("/github", passport.authenticate("github"));

sessionRouter.get(
    "/githubcallback", 
    passport.authenticate("github", { failureRedirect: "/session/failregister"}),
    (req, res) => {
        console.log("\n\n");
        console.log(req);
        console.log("\n\n");

        
        console.log("user_info: ");
        console.log(req.session.user_info);
        let user_info = ({...req.user}._doc);
        delete user_info._id; delete user_info.__v;
        console.log("github \n\n");
        console.log(user_info);
        req.session.user_info = user_info
        // user_info = { ...user_info, full_name: `${user_info.first_name} ${user_info.last_name}`};
        // req.session.user_info = user_info;


        
        console.log("user_info: ");
        console.log();
        console.log(req.session.user_info);



        // req.session.user_info.username = req.user
        res.redirect("/api/products")
    }
);



sessionRouter.get("/recover", (req, res) => {
    res.render("recover_password", {});
})

sessionRouter.post("/recover", async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({email});

    if (!user) return res.status(401).send({
        status: "error", 
        message: "No existe un usuario ligado a este email"
    });

    user.password = createHash(password);
    await user.save();

    res.status(200).send({
        status: "success",
        message: "Contraseña actualizada"
    })






});


sessionRouter.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send({status: "Logout error", message: err})
        res.render("logout", {});
    });
});

module.exports = {
    sessionRouter
}