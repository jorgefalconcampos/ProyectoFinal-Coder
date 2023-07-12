const authorization = role => {
    return async (req, res, next) => {
        // console.log("\n\nUser info en auth midleware: ");
        // console.log(req.session.user_info);

        // if (!req.user) return res.status(401).json({"status": "error", error: "Unauthorized!!!!!!!"})

        if (req.session?.user_info) {
            if (req.session.user_info.role !== role) return res.status(403).json({"status": "error", error: "No permissions!!!!!!!"})
            next()
        }
        else { res.redirect("/login-required"); }
    }
}

module.exports = {
    authorization
}