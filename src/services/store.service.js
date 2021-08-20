const { validateId, validateStoreBody } = require('./../utils/validator');
const { copyPropsFromObj } = require('../utils/lib');

module.exports = ({ db }) => ({
    getAllStores: () => new Promise(async (resolve, reject) => {
        try {
            const stores = await db.models.Store.find();
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
            const valid = validateId('storeId', storeIdStr, 'path');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            const storeId = valid.value;

            const store = await db.models.Store.findOne({ storeId });
            if (!store) {
                return reject({
                    statusCode: 400,
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

    createStore: (body) => new Promise(async (resolve, reject) => {
        const now = new Date();
        try {
            const valid = validateStoreBody(body, 'insert');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }

            const storeDoc = {
                storeId: new Date().getTime(),
                ...copyPropsFromObj(['name', 'location', 'phone'], body),
                createdOn: now.toISOString()
            };

            const result = await db.models.Store.create(storeDoc);
            resolve(result);
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    updateStore: (body) => new Promise(async (resolve, reject) => {
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

            const queryObj = { storeId: body.storeId };
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
            updateObj.updatedOn = now.toISOString();

            const result = await db.models.Store.updateOne(queryObj, updateObj);

            if (result.n === 0) {
                return reject({
                    statusCode: 400,
                    errorMessage: `Store not found against against storeId: ${queryObj.storeId}`
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

    deleteStore: (storeIdStr) => new Promise(async (resolve, reject) => {
        const now = new Date();
        try {
            const valid = validateId('storeId', storeIdStr, 'path');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            const storeId = valid.value;

            const queryObj = { storeId };
            const updateObj = { isDeleted: true, deletedOn: now.toISOString() };
            const result = await db.models.Store.updateOne(queryObj, updateObj);

            if (result.n === 0) {
                return reject({
                    statusCode: 400,
                    errorMessage: `Store not found against against storeId: ${storeId}`
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