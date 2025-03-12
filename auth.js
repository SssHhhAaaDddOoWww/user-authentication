const jwt = require("jsonwebtoken");
const SECRET_KEY = "";

function auth(req, res, next) {
    const token = req.headers.authorization;

    const response = jwt.verify(token, SECRET_KEY);

    if (response) {
        req.userId = response.id;
        next();
    } else {
        res.status(403).json({
            message: "Incorrect creds"
        })
    }
}

module.exports = {
    auth,
    SECRET_KEY
}