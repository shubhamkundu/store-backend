const { validateId, validateStoreRequestBody, validateStoreRequestRejectBody } = require('../utils/validator');
const { copyPropsFromObj } = require('../utils/lib');

const CONSTANTS = {
    PENDING_STATUS: 'pending',
    APPROVED_STATUS: 'approved',
    REJECTED_STATUS: 'rejected',
    DELETED_STATUS: 'deleted'
}

module.exports = ({ db }) => ({
    getAllStoreRequests: () => new Promise(async (resolve, reject) => {
        try {
            const storeRequests = await db.models.StoreRequest.find({ isDeleted: { $ne: true } });
            resolve(storeRequests);
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    getStoreRequestByStoreRequestId: (storeRequestIdStr) => new Promise(async (resolve, reject) => {
        try {
            const valid = validateId('storeRequestId', storeRequestIdStr, 'query');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            const storeRequestId = valid.value;

            const storeRequest = await db.models.StoreRequest.findOne({ storeRequestId, isDeleted: { $ne: true } });
            if (!storeRequest) {
                return reject({
                    statusCode: 404,
                    errorMessage: `StoreRequest not found for storeRequestId: ${storeRequestId}`
                });
            }
            resolve(storeRequest);
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    getStoreRequestsByStoreRequestor: (loggedInUser) => new Promise(async (resolve, reject) => {
        try {
            const storeRequests = await db.models.StoreRequest
                .find({ createdBy: loggedInUser.userId, isDeleted: { $ne: true } });
            resolve(storeRequests);
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    createStoreRequest: (body, loggedInUser) => new Promise(async (resolve, reject) => {
        const now = new Date();
        try {
            const valid = validateStoreRequestBody(body, 'insert');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            if (body.storeRequestType === 'update' && !valid.updateRequired) {
                return reject({
                    statusCode: 400,
                    errorMessage: `Provide at least one value to create a store update request`
                });
            }

            // reject if user has any pending store request
            let storeRequest = await db.models.StoreRequest.findOne({
                createdBy: loggedInUser.userId,
                storeRequestStatus: CONSTANTS.PENDING_STATUS,
                isDeleted: { $ne: true }
            });
            if (storeRequest) {
                return reject({
                    statusCode: 400,
                    errorMessage: `You already have another 'pending' storeRequest, please update that`
                });
            }

            if (body.storeRequestType === 'insert') {
                // reject if user has any store
                let store = await db.models.Store.findOne({ storeOwnerId: loggedInUser.userId, isDeleted: { $ne: true } });
                if (store) {
                    return reject({
                        statusCode: 400,
                        errorMessage: `You already have a store: ${store.name}, you cannot have one more`
                    });
                }
            }

            // reject if store request exists with same phone
            storeRequest = await db.models.StoreRequest.findOne({
                phone: body.phone,
                storeRequestStatus: CONSTANTS.PENDING_STATUS,
                isDeleted: { $ne: true }
            });
            if (storeRequest) {
                return reject({
                    statusCode: 400,
                    errorMessage: `'pending' store request exists with same phone`
                });
            }

            // reject if store exists with same phone
            store = await db.models.Store.findOne({
                phone: body.phone,
                storeOwnerId: { $ne: loggedInUser.userId },
                isDeleted: { $ne: true }
            });
            if (store) {
                return reject({
                    statusCode: 400,
                    errorMessage: `store exists with same phone`
                });
            }

            const storeRequestDoc = {
                storeRequestId: now.getTime(),
                ...copyPropsFromObj([
                    'storeId',
                    'storeOwnerId',
                    'name',
                    'location',
                    'phone',
                    'storeRequestType'
                ], body),
                storeRequestStatus: CONSTANTS.PENDING_STATUS,
                createdOn: now.toISOString(),
                createdBy: loggedInUser.userId
            };

            const resultStoreRequest = await db.models.StoreRequest.create(storeRequestDoc);
            const resultUser = await db.models.User
                .updateOne({ userId: loggedInUser.userId, isDeleted: { $ne: true } }, { storeRequestId: storeRequestDoc.storeRequestId });
            resolve({ resultStoreRequest, resultUser });
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    updateStoreRequest: (body, loggedInUser) => new Promise(async (resolve, reject) => {
        const now = new Date();
        try {
            let valid = validateId('storeRequestId', body.storeRequestId, 'body');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            body.storeRequestId = valid.value;

            valid = validateStoreRequestBody(body, 'update');
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

            const queryObj = { storeRequestId: body.storeRequestId, isDeleted: { $ne: true } };
            const updateObj = {};
            if (body.name) {
                updateObj.name = body.name;
            }
            if (body.location) {
                updateObj.location = body.location;
            }
            if (body.phone) {
                // reject if store request exists with same phone
                const storeRequest = await db.models.StoreRequest.findOne({
                    phone: body.phone,
                    storeRequestStatus: CONSTANTS.PENDING_STATUS,
                    isDeleted: { $ne: true }
                });
                if (storeRequest) {
                    return reject({
                        statusCode: 400,
                        errorMessage: `'pending' store request exists with same phone`
                    });
                }

                // reject if store exists with same phone
                const store = await db.models.Store.findOne({
                    phone: body.phone,
                    storeOwnerId: { $ne: loggedInUser.userId },
                    isDeleted: { $ne: true }
                });
                if (store) {
                    return reject({
                        statusCode: 400,
                        errorMessage: `store exists with same phone`
                    });
                }

                updateObj.phone = body.phone;
            }
            updateObj.updatedOn = now.toISOString();
            updateObj.updatedBy = loggedInUser.userId;

            const result = await db.models.StoreRequest.updateOne(queryObj, updateObj);

            if (result.n === 0) {
                return reject({
                    statusCode: 404,
                    errorMessage: `Store request not found against storeRequestId: ${queryObj.storeRequestId}`
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

    approveStoreRequest: (storeRequestIdStr, loggedInUser) => new Promise(async (resolve, reject) => {
        const now = new Date();
        try {
            const valid = validateId('storeRequestId', storeRequestIdStr, 'query');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            const storeRequestId = valid.value;

            const queryObj = {
                storeRequestId,
                storeRequestStatus: CONSTANTS.PENDING_STATUS,
                isDeleted: { $ne: true }
            };
            const updateObj = {
                storeRequestStatus: CONSTANTS.APPROVED_STATUS,
                approvedOn: now.toISOString(),
                approvedBy: loggedInUser.userId
            };
            const storeRequestApproveResult = await db.models.StoreRequest.updateOne(queryObj, updateObj);

            if (storeRequestApproveResult.n === 0) {
                return reject({
                    statusCode: 404,
                    errorMessage: `'pending' store request not found against storeRequestId: ${storeRequestId}`
                });
            }

            const queryUserObj = { storeRequestId };
            const updateUserObj = { $unset: { storeRequestId: 1 } };
            const userUpdateResult = await db.models.User.updateOne(queryUserObj, updateUserObj);

            resolve({ storeRequestApproveResult, userUpdateResult });
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    rejectStoreRequest: (body, loggedInUser) => new Promise(async (resolve, reject) => {
        const now = new Date();
        try {
            let valid = validateId('storeRequestId', body.storeRequestId, 'body');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            body.storeRequestId = valid.value;
            valid = validateStoreRequestRejectBody(body);
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }

            const queryObj = {
                storeRequestId: body.storeRequestId,
                storeRequestStatus: CONSTANTS.PENDING_STATUS,
                isDeleted: { $ne: true }
            };
            const updateObj = {
                storeRequestStatus: CONSTANTS.REJECTED_STATUS,
                rejectReason: body.rejectReason,
                rejectedOn: now.toISOString(),
                rejectedBy: loggedInUser.userId
            };
            const storeRequestRejectResult = await db.models.StoreRequest.updateOne(queryObj, updateObj);

            if (storeRequestRejectResult.n === 0) {
                return reject({
                    statusCode: 404,
                    errorMessage: `'pending' store request not found against storeRequestId: ${body.storeRequestId}`
                });
            }

            const queryUserObj = { storeRequestId: body.storeRequestId };
            const updateUserObj = { $unset: { storeRequestId: 1 } };
            const userUpdateResult = await db.models.User.updateOne(queryUserObj, updateUserObj);

            resolve({ storeRequestRejectResult, userUpdateResult });
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    }),

    deleteStoreRequest: (storeRequestIdStr, loggedInUser) => new Promise(async (resolve, reject) => {
        const now = new Date();
        try {
            const valid = validateId('storeRequestId', storeRequestIdStr, 'query');
            if (!valid.ok) {
                return reject({
                    statusCode: 400,
                    errorMessage: valid.reason
                });
            }
            const storeRequestId = valid.value;

            const queryObj = {
                storeRequestId,
                storeRequestStatus: CONSTANTS.PENDING_STATUS,
                isDeleted: { $ne: true }
            };
            const updateObj = {
                isDeleted: true,
                deletedOn: now.toISOString(),
                deletedBy: loggedInUser.userId
            };
            const storeRequestDeleteResult = await db.models.StoreRequest.updateOne(queryObj, updateObj);

            if (storeRequestDeleteResult.n === 0) {
                return reject({
                    statusCode: 404,
                    errorMessage: `'pending' store request not found against storeRequestId: ${storeRequestId}`
                });
            }

            const queryUserObj = { storeRequestId };
            const updateUserObj = { $unset: { storeRequestId: 1 } };
            const userUpdateResult = await db.models.User.updateOne(queryUserObj, updateUserObj);

            resolve({ storeRequestDeleteResult, userUpdateResult });
        } catch (e) {
            return reject({
                statusCode: 500,
                errorMessage: e
            });
        }
    })
});