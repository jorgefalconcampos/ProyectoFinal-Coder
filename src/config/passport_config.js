const passport = require("passport");
const LocalStrategy = require("passport-local");
const GithubStrategy = require("passport-github2");
const { userModel } = require("../manager/dao/models/users_model");
const { createHash } = require("../utils/helpers/hasher");
const { checkValidPassword } = require("../utils/helpers/pwd_validator");

const initializePassport = () => {
    passport.use(
        "register", // nombre de la strategy
        new LocalStrategy({
            passReqToCallback: true, // acceso al req
            usernameField: "email"
        },
        async (req, email, password, done) => {

            try {
                const { first_name, last_name, username } = req.body;

                const user = await userModel.findOne({email});

                if (user) {
                    done(null, false, {message: "Existe el usuario"});
                }
    
                const hashedPassword = createHash(password);
    
                const newUser = {
                    first_name, 
                    last_name, 
                    username, 
                    email,
                    password: hashedPassword
                };
    
                const result = await userModel.create(newUser);
                return done(null, result)
                        
            } catch (error) {
                console.log(error);
                return done(error)
            }

        })
    );

    passport.use("login", 
    new LocalStrategy({
        usernameField: "username",
    }, 
    async (username, password, done) => {
        try {
            const user = await userModel.findOne({username});
            
            if (!user) {
                return done(null, false);
            }
            const isValidPassword = checkValidPassword({
                hashedPassword: user.password,
                password,
            });

            if (!isValidPassword) {
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
        clientID: "Iv1.e85103520356d31b",
        clientSecret: "a48808adc386ebf6d4f4b09fb9014d3fba4ea100",
        callbackURL: "http://localhost:8080/githubcallback",
        scope: ["user:email"]


    }, async (accessToken, refreshToken, profile, done) => {
        console.log({profile});

        try {
            const user = await userModel.findOne({ email: profile.emails[0].value});
            if (!user) {
                const newUser = {
                    first_name: profile._json.name,
                    last_name: profile._json.name,
                    // last_name: ".",
                    username: profile.username,
                    email: profile.emails[0].value,
                    password: "."
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

        


    }  
    
    
    ));

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
    initializePassport
}


// github Client secret key
// a48808adc386ebf6d4f4b09fb9014d3fba4ea100


// Client ID: Iv1.e85103520356d31b