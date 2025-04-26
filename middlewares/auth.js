const isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth');
    }
    next();
};

const isNotAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/profile');
    }
    next();
};

module.exports = {
    isAuthenticated,
    isNotAuthenticated
}; 