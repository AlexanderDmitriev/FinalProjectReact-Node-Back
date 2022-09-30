const queryString = require('query-string');
const axios = require('axios');
const { v4 } = require('uuid');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../../models/user');
const { SECRET_KEY } = process.env;

// GOOGLE ************************************************
const googleAuth = async (req, res) => {
    const stringifiedParams = queryString.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: `${process.env.BASE_URL}/api/users/google-redirect`,
        scope: [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
        ].join(" "),
        response_type: "code",
        access_type: "offline",
        prompt: "consent"
    });
    return res.redirect(
        `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
    )
};

const googleRedirect = async (req, res) => {
    // console.log('googleRedirect ');
    const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
    const urlObj = new URL(fullUrl);
    const urlParams = queryString.parse(urlObj.search);
    const code = urlParams.code;
    // console.log(`code: ${code}`);
    const tokenData = await axios({
        url: `https://oauth2.googleapis.com/token`,
        method: "post",
        data: {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: `${process.env.BASE_URL}/api/users/google-redirect`,
            grant_type: "authorization_code",
            code,
        },
    });
    const userData = await axios({
        url: "https://www.googleapis.com/oauth2/v2/userinfo",
        method: "get",
        headers: { Authorization: `Bearer ${tokenData.data.access_token}`},
    });
    // console.log(`userData.email ${userData.data.email}`);
    // console.log(`userData.name ${userData.data.name}`);
    // GOOGLE END********************************************

    // SINGUP *********************************************
    const email = userData.data.email;
    const name = userData.data.name;
    let user = await User.findOne({ email });
    if (!user) {
        // console.log(`user not found!`)
        // const password = "111111";
        const password = v4();
        const hashPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashPassword });
        console.log(`User was created`)
    }
    //  ***************************************************

    //  LOGIN *********************************************
    user = await User.findOne({ email });;
    const peyload = { id: user._id };
    const token = jwt.sign(peyload, SECRET_KEY, { expiresIn: "24h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
        token,
    });
    console.log('Login is successful');
    //  ***************************************************
    // return res.redirect(
    //     `${process.env.FRONTEND_URL}?email=${userData.data.email}`
    //     // `${process.env.FRONTEND_URL}?token=${token}`
    // )
}

module.exports = {
    googleAuth,
    googleRedirect,
};