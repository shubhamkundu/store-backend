const { validateId, validateAdminBody } = require('./../utils/validator');

module.exports = ({ db }) => ({
    getAllAdmins: () => new Promise(async (resolve, reject) => {
        try {
            const admins = await db.models.Admin.find();
            resolve(admins);
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    getAdminByAdminId: (adminIdStr) => new Promise(async (resolve, reject) => {
        try {
            const valid = validateId('adminId', adminIdStr, 'path');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            const adminId = valid.value;

            const admin = await db.models.Admin.findOne({ adminId });
            if (!admin) {
                return reject({
                    statusCode: 400,
                    errorMessage: `Admin not found for adminId: ${adminId}`
                });
            }
            resolve(admin);
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    createAdmin: (body) => new Promise(async (resolve, reject) => {
        try {
            const valid = validateAdminBody(body, 'insert');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }

            const adminDoc = {
                adminId: new Date().getTime(),
                ...body
            };

            const result = await db.models.Admin.create(adminDoc);
            delete result._doc.password;
            resolve(result);
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    updateAdmin: (body) => new Promise(async (resolve, reject) => {
        try {
            let valid = validateId('adminId', body.adminId, 'body');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            body.adminId = valid.value;

            valid = validateAdminBody(body, 'update');
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

            const queryObj = { adminId: body.adminId };
            const updateObj = {};
            if (body.name) {
                updateObj.name = body.name;
            }
            if (body.email) {
                updateObj.email = body.email;
            }

            const result = await db.models.Admin.updateOne(queryObj, updateObj);

            if (result.n === 0) {
                return reject({
                    statusCode: 400,
                    errorMessage: `Admin not found against against adminId: ${queryObj.adminId}`
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

    deleteAdmin: (adminIdStr) => new Promise(async (resolve, reject) => {
        try {
            const valid = validateId('adminId', adminIdStr, 'path');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            const adminId = valid.value;

            const result = await db.models.Admin.deleteOne({ adminId });

            if (result.n === 0) {
                return reject({
                    statusCode: 400,
                    errorMessage: `Admin not found against against adminId: ${adminId}`
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