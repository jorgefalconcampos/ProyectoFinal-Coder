const passport = require("passport");
const LocalStrategy = require("passport-local");
const GithubStrategy = require("passport-github2");
const { userModel } = require("../manager/dao/models/users_model");
const { createHash } = require("../utils/helpers/hasher");
const { checkValidPassword } = require("../utils/helpers/pwd_validator");
const { getUserInfo } = require("../utils/middleware/get_user_info");
const { githubConfig } = require("../config/config");

const initializePassportAuth = () => {
    passport.use("register", // nombre de la strategy
        new LocalStrategy({
            passReqToCallback: true, // acceso al req
            usernameField: "email"
        },
        async (req, email, password, done) => {
            try {
                const { first_name, last_name, username } = req.body;
                const user = await userModel.findOne({email});
                if (user) {
                    req.session.messages = ["El email ya está en uso"]
                    return done(null, false); 
                }

                const usernameTaken = await userModel.exists({username: username});
                if (usernameTaken) {
                    req.session.messages = ["El nombre de usuario no está disponible"]
                    return done(null, false); 
                }
    
                const hashedPassword = createHash(password);
    
                const newUser = {
                    first_name, 
                    last_name, 
                    username, 
                    email,
                    role: "user",
                    password: hashedPassword
                };

                const result = await userModel.create(newUser);

                let user_info = newUser;
                delete user_info.password;  // eliminamos el campo password
                user_info = { ...user_info, full_name: `${user_info.first_name} ${user_info.last_name}`};
                req.session.user_info = user_info; // guardamos en session.user_info la data del usuario
                
                return done(null, result)
                        
            } catch (error) {                
                return done(error)
            }

        })
    );

    passport.use("login", 
        new LocalStrategy({
            passReqToCallback: true, // acceso al req
            usernameField: "username",
        }, 
        async (req, username, password, done) => {
            try {
                const user = await userModel.findOne({username});

                if (!user) {
                    req.session.messages = ["Usuario o contraseña incorrectos"]
                    return done(null, false);
                }
                const isValidPassword = checkValidPassword({
                    hashedPassword: user.password,
                    password,
                });

                if (!isValidPassword) {
                    req.session.messages = ["Usuario o contraseña incorrectos"]
                    done(null, false)
                }                
                
                return done(null, user)
            } catch (error) {
                console.log(error);
                return done(error)
            }
        }   
    ));

    passport.use("github", new GithubStrategy({
        clientID: githubConfig.clientID,
        clientSecret: githubConfig.clientSecret,
        callbackURL: githubConfig.callbackURL,
        scope: ["user:email"]
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await userModel.findOne({ email: profile.emails[0].value});
            if (!user) {
                const newUser = {
                    first_name: profile._json.name,
                    last_name: profile._json.name,
                    full_name: profile._json.name,
                    username: profile.username,
                    email: profile.emails[0].value,
                    password: ".",
                    role: "admin"
                };
                const result = await userModel.create(newUser);
                return done (null, result);
            }
            else {
                return done(null, user);
            }            
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

module.exports = {
    initializePassportAuth
}

