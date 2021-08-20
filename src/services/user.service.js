const { validateId, validateUserBody } = require('../utils/validator');
const { copyPropsFromObj } = require('../utils/lib');

module.exports = ({ db }) => ({
    getAllUsers: () => new Promise(async (resolve, reject) => {
        try {
            const users = await db.models.User.find();
            resolve(users);
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    getUserByUserId: (userIdStr) => new Promise(async (resolve, reject) => {
        try {
            const valid = validateId('userId', userIdStr, 'path');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            const userId = valid.value;

            const user = await db.models.User.findOne({ userId });
            if (!user) {
                return reject({
                    statusCode: 400,
                    errorMessage: `User not found for userId: ${userId}`
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

    createUser: (body) => new Promise(async (resolve, reject) => {
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

    updateUser: (body) => new Promise(async (resolve, reject) => {
        const now = new Date();
        try {
            let valid = validateId('userId', body.userId, 'body');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            body.userId = valid.value;

            valid = validateUserBody(body, 'update');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            if (!valid.updateRequired) {
                return reject({
                    statusCode: 400,
                    errorMessage: `Provide at least one value to update`
                });
            }

            const queryObj = { userId: body.userId };
            const updateObj = {};
            if (body.name) {
                updateObj.name = body.name;
            }
            if (body.email) {
                updateObj.email = body.email;
            }
            updateObj.updatedOn = now.toISOString();

            const result = await db.models.User.updateOne(queryObj, updateObj);

            if (result.n === 0) {
                return reject({
                    statusCode: 400,
                    errorMessage: `User not found against against userId: ${queryObj.userId}`
                });
            }

            resolve({ result, updateObj });
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    updateUserRole: (body) => new Promise(async (resolve, reject) => {
        const now = new Date();
        try {
            let valid = validateId('userId', body.userId, 'body');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }

            valid = validateUserRole(body.userRole);
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }

            const queryObj = { userId };
            const updateObj = { userRole, updatedOn: now.toISOString() };
            const result = await db.models.User.updateOne(queryObj, updateObj);

            if (result.n === 0) {
                return reject({
                    statusCode: 400,
                    errorMessage: `User not found against against userId: ${queryObj.userId}`
                });
            }

            resolve({ result, updateObj });
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    deleteUser: (userIdStr) => new Promise(async (resolve, reject) => {
        const now = new Date();
        try {
            const valid = validateId('userId', userIdStr, 'path');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            const userId = valid.value;

            const queryObj = { userId };
            const updateObj = { isDeleted: true, deletedOn: now.toISOString() };
            const result = await db.models.User.updateOne(queryObj, updateObj);

            if (result.n === 0) {
                return reject({
                    statusCode: 400,
                    errorMessage: `User not found against against userId: ${userId}`
                });
            }

            resolve({ result, updateObj });
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    })
});