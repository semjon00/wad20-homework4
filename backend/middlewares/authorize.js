const UserModel = require('../models/UserModel');
const jwt = require("../library/jwt");

module.exports = (request, response, next) => {

    // This is the place where you will need to implement authorization
    /*
        Pass access token in the Authorization header and verify
        it here using 'jsonwebtoken' dependency. Then set request.currentUser as
        decoded user from access token.
    */

    try {
        if (!request.headers.authorization)
            throw 'No token'

        token = jwt.verifyAccessToken(request.headers.authorization.slice(7))
        if (token === false)
            throw 'Invalid token'
        if (Date.now() >= token.exp * 1000)
            throw 'Token expired'

        UserModel.getById(token.authenticatedUser, (user) => {
            request.currentUser = user;
            next();
        });
    } catch (msg) {
        return response.status(403).json({
            message: msg
        });
    }
};