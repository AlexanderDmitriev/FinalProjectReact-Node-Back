const { RequestError } = require('../helpers/index');

const validationBody = shema => {
    const func = async (req, res, next) => {
        const { error } = shema.validate(req.body);
        if (error) {
            next(RequestError(400, error.message));
        }
        next();
    }
    return func;
}

module.exports = validationBody;