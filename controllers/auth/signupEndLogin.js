const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../../models/user');
const { RequestError } = require('../../helpers/index');
const { SECRET_KEY } = process.env;

const signupEndLogin = async (req, res) => { 
    let { name, email, password } = req.body;
    // SINGUP *********************************************
    email = email.toLowerCase();
    let user = await User.findOne({ email });
    if (user) {
        throw RequestError(409, "Email already exist");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    
    const result = await User.create({ name, email, password: hashPassword });

    //  LOGIN *********************************************
    user = await User.findOne({ email });
    const peyload = {
        id: user._id
    }
    const token = jwt.sign(peyload, SECRET_KEY, { expiresIn: "24h" });
    await User.findByIdAndUpdate(user._id, { token });

    res.status(201).json({
        name: result.name,
        email: result.email,
        token,
    });
}

module.exports = signupEndLogin;