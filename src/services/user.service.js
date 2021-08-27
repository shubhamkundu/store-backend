const { validateId, validateUserBody, validateEmail, validateUserRole } = require('./../utils/validator');

module.exports = ({ db }) => ({
    getAllUsers: () => new Promise(async (resolve, reject) => {
        try {
            const users = await db.models.User.find({ isDeleted: { $ne: true } });
            users.forEach(user => {
                delete user._doc.password;
            })
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
            const valid = validateId('userId', userIdStr, 'query');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            const userId = valid.value;

            const user = await db.models.User.findOne({ userId, isDeleted: { $ne: true } });
            if (!user) {
                return reject({
                    statusCode: 404,
                    errorMessage: `User not found for userId: ${userId}`
                });
            }
            delete user._doc.password;
            resolve(user);
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

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
            delete user._doc.password;
            resolve(user);
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    updateUser: (body, loggedInUser) => new Promise(async (resolve, reject) => {
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

            const queryObj = { userId: body.userId, isDeleted: { $ne: true } };
            const updateObj = {};
            if (body.name) {
                updateObj.name = body.name;
            }
            if (body.email) {
                updateObj.email = body.email;
            }
            updateObj.updatedOn = now.toISOString();
            updateObj.updatedBy = loggedInUser.userId;

            const result = await db.models.User.updateOne(queryObj, updateObj);

            if (result.n === 0) {
                return reject({
                    statusCode: 404,
                    errorMessage: `User not found against userId: ${queryObj.userId}`
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

    updateUserRole: (body, loggedInUser) => new Promise(async (resolve, reject) => {
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

            valid = validateUserRole(body.userRole);
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }

            const queryObj = { userId: body.userId, isDeleted: { $ne: true } };
            const updateObj = {
                userRole: body.userRole,
                updatedOn: now.toISOString(),
                updatedBy: loggedInUser.userId
            };
            const result = await db.models.User.updateOne(queryObj, updateObj);

            if (result.n === 0) {
                return reject({
                    statusCode: 404,
                    errorMessage: `User not found against userId: ${queryObj.userId}`
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

    deleteUser: (userIdStr, loggedInUser) => new Promise(async (resolve, reject) => {
        const now = new Date();
        try {
            const valid = validateId('userId', userIdStr, 'query');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            const userId = valid.value;

            const queryObj = { userId, isDeleted: { $ne: true } };
            const updateObj = {
                isDeleted: true,
                deletedOn: now.toISOString(),
                deletedBy: loggedInUser.userId
            };
            const userDeleteResult = await db.models.User.updateOne(queryObj, updateObj);

            if (userDeleteResult.n === 0) {
                return reject({
                    statusCode: 404,
                    errorMessage: `User not found against userId: ${userId}`
                });
            }

            const store = await db.models.Store
                .findOne({ storeOwner: userId, isDeleted: { $ne: true } });
            let storeDeleteResult = null, productDeleteResult = null;
            if (store) {
                const storeQueryObj = { storeId: store.storeId, isDeleted: { $ne: true } };
                storeDeleteResult = await db.models.Store.updateOne(storeQueryObj, updateObj);
                const productQueryObj = storeQueryObj;
                productDeleteResult = await db.models.Product.update(productQueryObj, updateObj);
            }

            resolve({ userDeleteResult, storeDeleteResult, productDeleteResult });
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    })
});