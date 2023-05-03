
const requireUser = (req, res, next) => {
    const username = req.session?.user?.username;
    if (!username) {
        res.redirect('/');
    } else {
        req.usr = username;
        next()
    }
  };

module.exports = {
    requireUser
}