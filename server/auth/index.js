//AUTH MIDDLEWARE
const jwt = require("jsonwebtoken")
//Does two things: 1- makes/signs the new token when the user logs in, and 2- verifies the token for post login requests
function authManager() {
    verify = function (req, res, next) {
        try {
            const token = req.cookies.token;
            //If there is no token (null), then return failure status
            if (!token) {
                return res.status(401).json({
                    loggedIn: false,
                    user: null,
                    errorMessage: "Unauthorized"
                })
            }

            const verified = jwt.verify(token, process.env.JWT_SECRET)
            req.userId = verified.userId; //Send on the user info

            next(); //Now execute controller code (or the next middleware)
        } catch (err) {
            console.error(err);
            return res.status(401).json({
                errorMessage: "Unauthorized"
            });
        }
    }

    signToken = function (user) {
        //
        return jwt.sign({
            userId: user._id
        }, process.env.JWT_SECRET);
    }

    return this;
}

const auth = authManager();
module.exports = auth;