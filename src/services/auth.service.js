const { validateUserBody, validateLoginBody, validateEmail } = require('./../utils/validator');
const { copyPropsFromObj, comparePassword, generateToken } = require('./../utils/lib');

module.exports = ({ db }) => {
    const serviceFns = {
        getUserByEmail: (email) => new Promise(async (resolve, reject) => {
            try {
                const valid = validateEmail(email);
                if (!valid.ok) {
                    return reject({
                        statusCode: 400,
                        errorMessage: valid.reason
                    });
                }
                email = email.trim();

                const user = await db.models.User.findOne({ email, isDeleted: { $ne: true } });
                if (!user) {
                    return reject({
                        statusCode: 404,
                        errorMessage: `User not found for email: ${email}`
                    });
                }
                resolve(user);
            } catch (e) {
                return reject({
                    statusCode: 500,
                    errorMessage: e
                });
            }
        }),

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

                const user = await db.models.User.findOne({ email: body.email, isDeleted: { $ne: true } });
                if (user) {
                    return reject({
                        statusCode: 400,
                        errorMessage: 'Email already exists.'
                    });
                }

                const userDoc = {
                    userId: new Date().getTime(),
                    ...copyPropsFromObj(['name', 'email', 'password'], body),
                    createdOn: now.toISOString()
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
                resolve({ token, user: user._doc });
            } catch (e) {
                return reject({
                    statusCode: e.statusCode || 500,
                    errorMessage: e.errorMessage || e
                });
            }
        })
    };
    return serviceFns;
};