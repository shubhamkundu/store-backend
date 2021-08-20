const { validateId, validateProductBody } = require('./../utils/validator');

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
                ...body
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
            if (body.location) {
                updateObj.location = body.location;
            }
            if (body.phone) {
                updateObj.phone = body.phone;
            }

            const result = await db.models.Product.updateOne(queryObj, updateObj);

            if (result.n === 0) {
                return reject({
                    statusCode: 400,
                    errorMessage: `Product not found against against productId: ${queryObj.productId}`
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

    deleteProduct: (productIdStr) => new Promise(async (resolve, reject) => {
        try {
            const valid = validateId('productId', productIdStr, 'path');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            const productId = valid.value;

            const result = await db.models.Product.deleteOne({ productId });

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