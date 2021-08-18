module.exports = ({ db }) => ({
    getAllStores: () => new Promise((resolve, reject) => {
        db.models.Store.find((err, stores) => {
            if (err) return reject(err);
            resolve(stores);
        });
    }),

    getStoreByStoreId: (storeIdStr) => new Promise((resolve, reject) => {
        if (storeIdStr == null) {
            return reject({
                statusCode: 400,
                errorMessage: `Please provide storeId as request path parameter`
            });
        }
        const storeId = parseInt(storeIdStr);
        if (isNaN(storeId) || storeId <= 0) {
            return reject({
                statusCode: 400,
                errorMessage: `Please provide a positive integer value for storeId`
            });
        }

        db.models.Store.findOne({ storeId }, (err, store) => {
            if (err) {
                return reject({
                    statusCode: 500,
                    errorMessage: err
                });
            }
            resolve(store);
        });
    }),

    saveStore: (body) => new Promise((resolve, reject) => {
        if (typeof body.name !== 'string' || body.name.trim() === '') {
            return reject({
                statusCode: 400,
                errorMessage: `Please provide string value for name in request body`
            });
        }
        if (typeof body.location !== 'string' || body.location.trim() === '') {
            return reject({
                statusCode: 400,
                errorMessage: `Please provide string value for location in request body`
            });
        }
        if (typeof body.phone !== 'number' || !Number.isInteger(body.phone)) {
            return reject({
                statusCode: 400,
                errorMessage: `Please provide integer value for phone in request body`
            });
        }
        if (('' + body.phone).length != 10) {
            return reject({
                statusCode: 400,
                errorMessage: `Please provide 10-digit integer value for phone in request body`
            });
        }

        const storeDoc = {
            storeId: new Date().getTime(),
            ...body
        };

        db.models.Store.save(storeDoc, (err, store) => {
            if (err) {
                return reject({
                    statusCode: 500,
                    errorMessage: err
                });
            }
            resolve(store);
        });
    })
});