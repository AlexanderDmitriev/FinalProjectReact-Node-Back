const queryString = require('query-string');
// npm install query-string
const axios = require('axios');
// npm install axios
const { v4 } = require('uuid');

const { User } = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;

const googleAuth = async (req, res) => {
    const stringifiedParams = queryString.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: `${process.env.BASE_URL}/api/auth/google-redirect`,
        scope: [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
        ].join(" "),
        response_type: "code",
        access_type: "offline",
        prompt: "consent"
    });
    console.log('1');
    return res.redirect(
        `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
    )
};

const googleRedirect = async (req, res) => {
    console.log('2');
    const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    const urlObj = new URL(fullUrl);
    const urlParams = queryString.parse(urlObj.search);

    const code = urlParams.code;
    console.log(`code: ${code}`);

    const tokenData = await axios({
        url: `https://oauth2.googleapis.com/token`,
        method: "post",
        data: {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: `${process.env.BASE_URL}/api/auth/google-redirect`,
            grant_type: "authorization_code",
            code,
        },
    });
    console.log('3');
    
    const userData = await axios({
        url: "https://www.googleapis.com/oauth2/v2/userinfo",
        method: "get",
        headers: {
        Authorization: `Bearer ${tokenData.data.access_token}`,
        },
    });
    console.log(`userData.email ${userData.data.email}`);
    console.log(`userData.name ${userData.data.name}`);
    // GOOGLE END********************************************

    // SINGUP *********************************************
    const googleEmail = userData.data.email;
    const googleName = userData.data.name;
    const email = googleEmail;
    const name = googleName
    // const checkUser = await User.findOne({ googleEmail });

    const user = await User.findOne({ email });
    console.log('4/1')
    if (user) {
        console.log(`user: ${user.name} found!`)
    }
        
    // const password = "111111";
    const password = v4();
   // const hashPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password });
    console.log('4')
    // }
    //  ***************************************************

    //  LOGIN *********************************************
    // const user = await User.findOne({ email });
    console.log('user', user)
    
    const peyload = {
        id: user._id
    }
    console.log('peyload', peyload)
    const token = jwt.sign(peyload, SECRET_KEY, { expiresIn: "24h" });
    console.log('token', token)
        await User.findByIdAndUpdate(user._id, { token });
        // res.json({
        //     token,
        // });
    console.log('5');
    //  ***************************************************

    return res.redirect(
        `${process.env.FRONTEND_URL}?email=${userData.data.email}&name=${userData.data.name}`
    )
}

module.exports = {
    googleAuth,
    googleRedirect,
};

