const jwt = require('jsonwebtoken');
const config = require('config');


module.exports = function(req, res, next) {
    // get token from Header
    const token = req.header('x-auth-token');
    // check if no token
    if(!token){
        return res.status(401).json({ msg: 'No token, Authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token is not valid' })
    }
}