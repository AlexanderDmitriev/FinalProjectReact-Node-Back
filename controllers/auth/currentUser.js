const currentUser = async (req, res) => {
    const {  name, email } = req.user;
    res.status(200).json({
        name,
        email,
    })
};

module.exports = currentUser;