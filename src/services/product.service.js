const { validateId, validateProductBody } = require('./../utils/validator');
const { copyPropsFromObj } = require('./../utils/lib');

module.exports = ({ db }) => ({
    getAllProducts: () => new Promise(async (resolve, reject) => {
        try {
            const products = await db.models.Product.find({ isDeleted: { $ne: true } });
            resolve(products);
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    getProductByProductId: (productIdStr) => new Promise(async (resolve, reject) => {
        try {
            const valid = validateId('productId', productIdStr, 'path');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            const productId = valid.value;

            const product = await db.models.Product.findOne({ productId, isDeleted: { $ne: true } });
            if (!product) {
                return reject({
                    statusCode: 404,
                    errorMessage: `Product not found for productId: ${productId}`
                });
            }
            resolve(product);
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    getProductsByStoreId: (storeIdStr, loggedInUser) => new Promise(async (resolve, reject) => {
        try {
            let storeId;
            const valid = validateId('storeId', storeIdStr, 'path');
            if (valid.ok && loggedInUser.userRole === 'admin') {
                storeId = valid.value;
            } else {
                const store = await db.models.Store
                    .findOne({ storeOwner: loggedInUser.userId, isDeleted: { $ne: true } });
                if (!store) {
                    if (loggedInUser.userRole === 'admin') {
                        return reject({
                            statusCode: 400,
                            errorMessage: `Store not found for storeOwner: ${loggedInUser.userId}, please provide a storeId in request path`
                        });
                    }
                    return reject({
                        statusCode: 404,
                        errorMessage: `Store not found for storeOwner: ${loggedInUser.userId}`
                    });
                }
                storeId = store.storeId;
            }

            const products = await db.models.Product.find({ storeId, isDeleted: { $ne: true } });
            resolve(products);
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    createProduct: (body, loggedInUser) => new Promise(async (resolve, reject) => {
        const now = new Date();
        try {
            let valid = validateProductBody(body, 'insert');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }

            let storeId;
            valid = validateId('storeId', body.storeId, 'body');
            if (valid.ok && loggedInUser.userRole === 'admin') {
                storeId = valid.value;
            } else {
                const store = await db.models.Store
                    .findOne({ storeOwner: loggedInUser.userId, isDeleted: { $ne: true } });
                if (!store) {
                    if (loggedInUser.userRole === 'admin') {
                        return reject({
                            statusCode: 400,
                            errorMessage: `Store not found for storeOwner: ${loggedInUser.userId}, please provide a storeId in request path`
                        });
                    }
                    return reject({
                        statusCode: 404,
                        errorMessage: `Store not found for storeOwner: ${loggedInUser.userId}`
                    });
                }
                storeId = store.storeId;
            }

            const productDoc = {
                productId: now.getTime(),
                ...copyPropsFromObj(['name', 'category', 'availableQuantity', 'description'], body),
                storeId,
                createdOn: now.toISOString(),
                createdBy: loggedInUser.userId
            };

            const result = await db.models.Product.create(productDoc);
            resolve(result);
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    updateProduct: (body, loggedInUser) => new Promise(async (resolve, reject) => {
        const now = new Date();
        try {
            let valid = validateId('productId', body.productId, 'body');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            body.productId = valid.value;

            if (loggedInUser.userRole !== 'admin') {
                const product = await db.models.Product.findOne({ productId: body.productId, isDeleted: { $ne: true } });
                if (!product) {
                    return reject({
                        statusCode: 404,
                        errorMessage: `Product not found against productId: ${queryObj.productId}`
                    });
                }
                const store = await db.models.Store.findOne({ storeId: product.storeId, isDeleted: { $ne: true } });
                if (!store) { // this scenario should not arise if delete store is handled properly
                    return reject({
                        statusCode: 404,
                        errorMessage: `Store not found against storeId: ${product.storeId}, for productId: ${queryObj.productId}`
                    });
                }
                if (store.storeOwner !== loggedInUser.userId) {
                    return reject({
                        statusCode: 403,
                        errorMessage: `Access Denied! Only admins can edit products of stores of other people`
                    });
                }
            }

            valid = validateProductBody(body, 'update');
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

            const queryObj = { productId: body.productId, isDeleted: { $ne: true } };
            const updateObj = {};
            if (body.name) {
                updateObj.name = body.name;
            }
            if (body.category) {
                updateObj.category = body.category;
            }
            if (body.availableQuantity) {
                updateObj.availableQuantity = body.availableQuantity;
            }
            if (body.description) {
                updateObj.description = body.description;
            }
            updateObj.updatedOn = now.toISOString();
            updateObj.updatedBy = loggedInUser.userId;

            const result = await db.models.Product.updateOne(queryObj, updateObj);

            if (result.n === 0) {
                return reject({
                    statusCode: 404,
                    errorMessage: `Product not found against productId: ${queryObj.productId}`
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

    deleteProduct: (productIdStr, loggedInUser) => new Promise(async (resolve, reject) => {
        const now = new Date();
        try {
            const valid = validateId('productId', productIdStr, 'path');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            const productId = valid.value;

            if (loggedInUser.userRole !== 'admin') {
                const product = await db.models.Product.findOne({ productId: body.productId, isDeleted: { $ne: true } });
                if (!product) {
                    return reject({
                        statusCode: 404,
                        errorMessage: `Product not found against productId: ${queryObj.productId}`
                    });
                }
                const store = await db.models.Store
                    .findOne({ storeId: product.storeId, isDeleted: { $ne: true } });
                if (!store) { // this scenario should not arise if delete store is handled properly
                    return reject({
                        statusCode: 404,
                        errorMessage: `Store not found against storeId: ${product.storeId}, for productId: ${queryObj.productId}`
                    });
                }
                if (store.storeOwner !== loggedInUser.userId) {
                    return reject({
                        statusCode: 403,
                        errorMessage: `Access Denied! Only admins can delete products of stores of other people`
                    });
                }
            }

            const queryObj = { productId, isDeleted: { $ne: true } };
            const updateObj = {
                isDeleted: true,
                deletedOn: now.toISOString(),
                deletedBy: loggedInUser.userId
            };
            const result = await db.models.Product.updateOne(queryObj, updateObj);

            if (result.n === 0) {
                return reject({
                    statusCode: 404,
                    errorMessage: `Product not found against productId: ${productId}`
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