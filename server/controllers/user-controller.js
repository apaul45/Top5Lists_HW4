const auth = require('../auth')
const User = require('../models/user-model')
//bcrypt is for registering/changing a password: 
const bcrypt = require('bcryptjs')

getLoggedIn = async (req, res) => {
    try{
        auth.verify(req, res, async function () {
            const loggedInUser = await User.findOne({ _id: req.userId });
            return res.status(200).json({
                loggedIn: true,
                user: {
                    firstName: loggedInUser.firstName,
                    lastName: loggedInUser.lastName,
                    email: loggedInUser.email,
                }
            }).send();
        })
    }
    catch(err){
        console.error(err);
        res.status(500).send();
    }
}
//registerUser uses salting & crypt to create a new hashed password,
//and then saves this password along with the other required fields as a new user
registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, passwordVerify } = req.body;
        if (!firstName || !lastName || !email || !password || !passwordVerify) {
            console.log(res
            .status(400)
            .json({ errorMessage: "Please enter all required fields." }));
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            console.log(res
                .status(400)
                .json({ errorMessage: "Please enter a password of at least 8 characters." }));
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            console.log(res
                .status(400)
                .json({ errorMessage:  "Please enter the same password twice." }));
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            console.log(res
                .status(400)
                .json({
                    errorMessage:  "An account with this email address already exists."
                }))
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }
        //saltRounds indicate the total number of different salts there are
        //salts are random values that get appended to the end of a hashed password to ensure randomness:
        //makes it harder for hackers to crack hashed passes using lookup tables and etc
        const saltRounds = 10;
        //generates the respective salt from the "pool" of salts
        const salt = await bcrypt.genSalt(saltRounds);
        //bcrypt, whih uses the Blowfish algorithm, hahses the registered pass w/ the generated salt val
        const passwordHash = await bcrypt.hash(password, salt);
        //Then a new user is created using the entered first & last names, email, and password
        const newUser = new User({
            firstName, lastName, email, passwordHash
        });
        const savedUser = await newUser.save();

        // LOGIN THE USER
        const token = auth.signToken(savedUser);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
            }
        }).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}
loginUser = async (req, res) => {
    try{
        console.log(req.body);
        //Destructure the body to get the email and password to be compared
        const{email, password} = req.body;
        //Check if all necessary fields were provided
        if (!email || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        //Check if the email the user entered exists in the current database
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "Wrong email or password"
                })
        }
        //Use bcrypt to check if the entered password matches the hashed one
        const correctPass = await bcrypt.compare(password, existingUser.passwordHash);
        if (!correctPass){
            return res.status(401).json({
                errorMessage: "Wrong email or password."
            })
        }
        //Log the user in by signing a jwt web token
        const token = auth.signToken(existingUser);
        //Attach token to response in http only cookie, and send success status to user
        //that contains the necessary user info
        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                email: existingUser.email,
            }
        }).send();
    } 
    catch(err){
        console.error(err);
        res.status(500).send();
    }
}
logoutUser = (req, res) => {
    try{
        res.clearCookie("token").status(200).json({ success: true });
    }
    catch(err){
        res.status(500).send();
    }
}
module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
}