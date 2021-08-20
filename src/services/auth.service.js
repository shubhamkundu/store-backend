const { validateUserBody, validateLoginBody } = require('./../utils/validator');
const { copyPropsFromObj, comparePassword, generateToken, generateUserObj } = require('../utils/lib');

module.exports = ({ db }) => {
    const serviceFns = {
        signup: (body) => new Promise(async (resolve, reject) => {
            const now = new Date();
            try {
                const valid = validateUserBody(body, 'insert');
                if (!valid.ok) {
                    return reject({
                        statusCode: 400,
                        errorMessage: valid.reason
                    });
                }

                const userDoc = {
                    userId: new Date().getTime(),
                    ...copyPropsFromObj(['name', 'email', 'password'], body),
                    createdOn: now.toISOString(),
                    createdBy: generateUserObj(loggedInUser)
                };

                const result = await db.models.User.create(userDoc);
                delete result._doc.password;
                resolve(result);
            } catch (e) {
                return reject({
                    statusCode: 500,
                    errorMessage: e
                });
            }
        }),

        login: (body) => new Promise(async (resolve, reject) => {
            const now = new Date();
            try {
                const valid = validateLoginBody(body);
                if (!valid.ok) {
                    return reject({
                        statusCode: 400,
                        errorMessage: valid.reason
                    });
                }

                const user = await serviceFns.getUserByEmail(body.email);
                const passwordMatched = await comparePassword(body.password, user.password);
                if (!passwordMatched) {
                    return reject({
                        statusCode: 401,
                        errorMessage: `Please enter correct password`
                    });
                }

                delete user._doc._id;
                delete user._doc.__v;
                delete user._doc.password;
                const token = generateToken(user._doc);
                resolve({ token });
            } catch (e) {
                return reject({
                    statusCode: 500,
                    errorMessage: e
                });
            }
        })
    };
    return serviceFns;
};