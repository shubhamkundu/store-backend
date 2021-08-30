const { validateId, validateStoreBody } = require('./../utils/validator');
const { copyPropsFromObj } = require('./../utils/lib');

module.exports = ({ db }) => ({
    getAllStores: () => new Promise(async (resolve, reject) => {
        try {
            const stores = await db.models.Store.find({ isDeleted: { $ne: true } });
            resolve(stores);
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    getStoreByStoreId: (storeIdStr) => new Promise(async (resolve, reject) => {
        try {
            const valid = validateId('storeId', storeIdStr, 'query');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            const storeId = valid.value;

            const store = await db.models.Store.findOne({ storeId, isDeleted: { $ne: true } });
            if (!store) {
                return reject({
                    statusCode: 404,
                    errorMessage: `Store not found for storeId: ${storeId}`
                });
            }
            resolve(store);
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    getStoreByStoreOwner: (loggedInUser) => new Promise(async (resolve, reject) => {
        try {
            const store = await db.models.Store
                .findOne({ storeOwnerId: loggedInUser.userId, isDeleted: { $ne: true } });
            resolve(store);
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    createStore: (body, loggedInUser) => new Promise(async (resolve, reject) => {
        const now = new Date();
        try {
            const valid = validateStoreBody(body, 'insert');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }

            const user = await db.models.User.findOne({ userId: body.storeOwnerId, isDeleted: { $ne: true } });
            if (!user) {
                return reject({
                    statusCode: 400,
                    errorMessage: `storeOwner with id: ${body.storeOwnerId} is not a valid user`
                });
            }

            let store = await db.models.Store.findOne({ storeOwnerId: body.storeOwnerId, isDeleted: { $ne: true } });
            if (store) {
                return reject({
                    statusCode: 400,
                    errorMessage: `storeOwner with id: ${body.storeOwnerId} already has another store`
                });
            }

            store = await db.models.Store.findOne({ phone: body.phone, isDeleted: { $ne: true } });
            if (store) {
                return reject({
                    statusCode: 400,
                    errorMessage: `phone already exists`
                });
            }

            const storeDoc = {
                storeId: now.getTime(),
                ...copyPropsFromObj(['name', 'location', 'phone', 'storeOwnerId'], body),
                createdOn: now.toISOString(),
                createdBy: loggedInUser.userId
            };

            const resultStore = await db.models.Store.create(storeDoc);
            const resultUser = await db.models.User
                .updateOne({ userId: body.storeOwnerId, isDeleted: { $ne: true } }, { storeId: storeDoc.storeId });
            resolve({ resultStore, resultUser });
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    updateStore: (body, loggedInUser) => new Promise(async (resolve, reject) => {
        const now = new Date();
        try {
            let valid = validateId('storeId', body.storeId, 'body');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            body.storeId = valid.value;

            valid = validateStoreBody(body, 'update');
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

            const queryObj = { storeId: body.storeId, isDeleted: { $ne: true } };
            const updateObj = {};
            if (body.name) {
                updateObj.name = body.name;
            }
            if (body.location) {
                updateObj.location = body.location;
            }
            if (body.phone) {
                updateObj.phone = body.phone;
                const store = await db.models.Store.findOne({ phone: body.phone, isDeleted: { $ne: true } });
                if (store) {
                    return reject({
                        statusCode: 400,
                        errorMessage: `phone already exists`
                    });
                }
            }
            updateObj.updatedOn = now.toISOString();
            updateObj.updatedBy = loggedInUser.userId;

            const result = await db.models.Store.updateOne(queryObj, updateObj);

            if (result.n === 0) {
                return reject({
                    statusCode: 404,
                    errorMessage: `Store not found against storeId: ${queryObj.storeId}`
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

    deleteStore: (storeIdStr, loggedInUser) => new Promise(async (resolve, reject) => {
        const now = new Date();
        try {
            const valid = validateId('storeId', storeIdStr, 'query');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            const storeId = valid.value;

            const queryObj = { storeId, isDeleted: { $ne: true } };
            const updateObj = {
                isDeleted: true,
                deletedOn: now.toISOString(),
                deletedBy: loggedInUser.userId
            };
            const storeDeleteResult = await db.models.Store.updateOne(queryObj, updateObj);

            if (storeDeleteResult.n === 0) {
                return reject({
                    statusCode: 404,
                    errorMessage: `Store not found against storeId: ${storeId}`
                });
            }

            const productDeleteResult = await db.models.Product.update(queryObj, updateObj);

            const queryUserObj = {
                storeId
            };
            const updateUserObj = {
                $unset: {
                    storeId: 1
                }
            };
            const userUpdateResult = await db.models.User.updateOne(queryUserObj, updateUserObj);

            resolve({ storeDeleteResult, productDeleteResult, userUpdateResult });
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    })
});