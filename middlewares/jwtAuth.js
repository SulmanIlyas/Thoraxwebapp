const jwt = require('jsonwebtoken');

//Middleware to verify the jwt token
const jwtAuth = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        const data = jwt.verify(token, process.env.SECRET);
        if (!data) return res.json({ error: 'Token is not valid' });
        req.token = data;
        next();
    } catch {
        res.json({ error: 'Token is not valid' });
    }

};

module.exports = jwtAuth;