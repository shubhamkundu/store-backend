const { validateId, validateSubUserBody } = require('./../utils/validator');

module.exports = ({ db }) => ({
    getAllSubUsers: () => new Promise(async (resolve, reject) => {
        try {
            const subUsers = await db.models.SubUser.find();
            resolve(subUsers);
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    getSubUserBySubUserId: (subUserIdStr) => new Promise(async (resolve, reject) => {
        try {
            const valid = validateId('subUserId', subUserIdStr, 'path');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            const subUserId = valid.value;

            const subUser = await db.models.SubUser.findOne({ subUserId });
            if (!subUser) {
                return reject({
                    statusCode: 400,
                    errorMessage: `SubUser not found for subUserId: ${subUserId}`
                });
            }
            resolve(subUser);
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    createSubUser: (body) => new Promise(async (resolve, reject) => {
        try {
            const valid = validateSubUserBody(body, 'insert');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }

            const subUserDoc = {
                subUserId: new Date().getTime(),
                ...body
            };

            const result = await db.models.SubUser.create(subUserDoc);
            resolve(result);
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    updateSubUser: (body) => new Promise(async (resolve, reject) => {
        try {
            let valid = validateId('subUserId', body.subUserId, 'body');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            body.subUserId = valid.value;

            valid = validateSubUserBody(body, 'update');
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

            const queryObj = { subUserId: body.subUserId };
            const updateObj = {};
            if (body.name) {
                updateObj.name = body.name;
            }
            if (body.location) {
                updateObj.location = body.location;
            }
            if (body.phone) {
                updateObj.phone = body.phone;
            }

            const result = await db.models.SubUser.updateOne(queryObj, updateObj);

            if (result.n === 0) {
                return reject({
                    statusCode: 400,
                    errorMessage: `SubUser not found against against subUserId: ${queryObj.subUserId}`
                });
            }

            resolve(result);
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    deleteSubUser: (subUserIdStr) => new Promise(async (resolve, reject) => {
        try {
            const valid = validateId('subUserId', subUserIdStr, 'path');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            const subUserId = valid.value;

            const result = await db.models.SubUser.deleteOne({ subUserId });

            if (result.n === 0) {
                return reject({
                    statusCode: 400,
                    errorMessage: `SubUser not found against against subUserId: ${subUserId}`
                });
            }

            resolve(result);
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    })
});