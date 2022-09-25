const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const { RequestError } = require('../../helpers/index');
const { User } = require('../../models/model_user');
// const { SECRET_KEY } = process.env;

const login = async (req, res) => {
    const { email, password, } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw RequestError(401, "Email not found");
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
        throw RequestError(401, "Password wrong");
    }
    // if(!user.verify) {
    //     throw RequestError(403, "Email not verify");
    // }
    const peyload = {
        id: user._id
    }
    const token = jwt.sign(peyload, SECRET_KEY, { expiresIn: "24h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
        token,
    });
};

module.exports = login;