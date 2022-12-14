const bcrypt = require('bcryptjs');

const { User } = require('../../models/user');
const { RequestError } = require('../../helpers/index');

const signup = async (req, res) => {
    let { name, email, password } = req.body;
    email = email.toLowerCase();
    const user = await User.findOne({ email });
    if (user) {
        throw RequestError(409, "Email already exist");
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const result = await User.create({ name, email, password: hashPassword });
    res.status(201).json({
        name: result.name,
        email: result.email,
    });
};

module.exports = signup;