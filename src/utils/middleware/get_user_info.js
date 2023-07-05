
const getUserInfo = (req, res, next) => {
    if (req.session.user_info) {
        console.log("si exist");
    }
    // req.session?.user_info?.username ? req.session.user_info : "";
    next();
};

module.exports = {
    getUserInfo
}
