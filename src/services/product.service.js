const { validateId, validateProductBody } = require('./../utils/validator');
const { copyPropsFromObj } = require('../utils/lib');

module.exports = ({ db }) => ({
    getAllProducts: () => new Promise(async (resolve, reject) => {
        try {
            const products = await db.models.Product.find();
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

            const product = await db.models.Product.findOne({ productId });
            if (!product) {
                return reject({
                    statusCode: 400,
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

    createProduct: (body) => new Promise(async (resolve, reject) => {
        const now = new Date();
        try {
            const valid = validateProductBody(body, 'insert');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }

            const productDoc = {
                productId: new Date().getTime(),
                ...copyPropsFromObj(['name', 'category', 'availableQuantity', 'description'], body),
                createdOn: now.toISOString()
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

    updateProduct: (body) => new Promise(async (resolve, reject) => {
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

            const queryObj = { productId: body.productId };
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

            const result = await db.models.Product.updateOne(queryObj, updateObj);

            if (result.n === 0) {
                return reject({
                    statusCode: 400,
                    errorMessage: `Product not found against against productId: ${queryObj.productId}`
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

    deleteProduct: (productIdStr) => new Promise(async (resolve, reject) => {
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

            const queryObj = { productId };
            const updateObj = { isDeleted: true, deletedOn: now.toISOString() };
            const result = await db.models.Product.updateOne(queryObj, updateObj);

            if (result.n === 0) {
                return reject({
                    statusCode: 400,
                    errorMessage: `Product not found against against productId: ${productId}`
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