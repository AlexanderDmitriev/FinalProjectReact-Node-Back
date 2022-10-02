const signup = require('./signup');
const login = require('./login');
const logout = require('./logout');
const currentUser = require('./currentUser');
const signupEndLogin = require('./signupEndLogin')

module.exports = {
    signup,
    login,
    logout,
    currentUser,
    signupEndLogin,
}