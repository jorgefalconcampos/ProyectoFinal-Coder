const passport = require("passport");
const LocalStrategy = require("passport-local");
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
        usernameField: "email",
    }, 
    async (email, password, done) => {
        try {
            const user = await userModel.findOne({email});

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
        } catch (error) {
            console.log(error);
            return done(error)
        }
    }   
    ))

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