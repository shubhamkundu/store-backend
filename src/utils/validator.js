const validationConfig = require('./../config/config').validation;
const { validateEmail, validatePassword } = require('./../utils/lib');

const CONSTANTS = {
    INSERT_REQUEST_TYPE: 'insert',
    UPDATE_REQUEST_TYPE: 'update',
    ALLOWED_STORE_REQUEST_TYPES: ['insert', 'update']
};

module.exports = {
    validateId: (idName, idStr, location) => {
        if (idStr == null) {
            return {
                ok: false,
                reason: `Please provide ${idName} in request ${location}`
            }
        }
        const id = parseInt(idStr);
        if (!Number.isInteger(id)) {
            return {
                ok: false,
                reason: `Please provide a positive integer value for ${idName}`
            }
        }
        return {
            ok: true,
            value: id
        };
    },

    validateStoreBody: (body, requestType) => {
        let updateRequired = false;
        if (requestType === CONSTANTS.INSERT_REQUEST_TYPE || body.name !== undefined) {
            updateRequired = true;
            if (typeof body.name !== 'string' || body.name.trim() === '') {
                return {
                    ok: false,
                    reason: `Please provide string value for name in request body`
                };
            }
            body.name = body.name.trim();
        }
        if (requestType === CONSTANTS.INSERT_REQUEST_TYPE || body.location !== undefined) {
            updateRequired = true;
            if (typeof body.location !== 'string' || body.location.trim() === '') {
                return {
                    ok: false,
                    reason: `Please provide string value for location in request body`
                };
            }
            body.location = body.location.trim();
        }
        if (requestType === CONSTANTS.INSERT_REQUEST_TYPE || body.phone !== undefined) {
            updateRequired = true;
            if (!(typeof body.phone === 'string' || typeof body.phone === 'number')) {
                return {
                    ok: false,
                    reason: `Please provide value for phone in request body`
                };
            }
            body.phone = parseInt(body.phone);
            if (!Number.isInteger(body.phone)) {
                return {
                    ok: false,
                    reason: `Please provide integer value for phone in request body`
                };
            }
            if (('' + body.phone).length != validationConfig.phoneLength) {
                return {
                    ok: false,
                    reason: `Please provide ${validationConfig.phoneLength}-digit integer value for phone in request body`
                };
            }
        }
        if (requestType === CONSTANTS.INSERT_REQUEST_TYPE || body.storeOwnerId !== undefined) {
            updateRequired = true;
            if (!(typeof body.storeOwnerId === 'string' || typeof body.storeOwnerId === 'number')) {
                return {
                    ok: false,
                    reason: `Please provide value for storeOwnerId in request body`
                };
            }
            body.storeOwnerId = parseInt(body.storeOwnerId);
            if (!Number.isInteger(body.storeOwnerId)) {
                return {
                    ok: false,
                    reason: `Please provide integer value for storeOwnerId in request body`
                };
            }
        }

        const result = { ok: true };
        if (requestType === CONSTANTS.UPDATE_REQUEST_TYPE) {
            result.updateRequired = updateRequired;
        }
        return result;
    },

    validateUserBody: (body, requestType) => {
        let updateRequired = false;
        if (requestType === CONSTANTS.INSERT_REQUEST_TYPE || body.name !== undefined) {
            updateRequired = true;
            if (typeof body.name !== 'string' || body.name.trim() === '') {
                return {
                    ok: false,
                    reason: `Please provide string value for name in request body`
                };
            }
            body.name = body.name.trim();
        }
        if (requestType === CONSTANTS.INSERT_REQUEST_TYPE || body.email !== undefined) {
            updateRequired = true;
            if (typeof body.email !== 'string' || body.email.trim() === '') {
                return {
                    ok: false,
                    reason: `Please provide string value for email in request body`
                };
            }
            body.email = body.email.trim();
            if (!validateEmail(body.email)) {
                return {
                    ok: false,
                    reason: `Please provide valid email in request body`
                };
            }
        }
        if (requestType === CONSTANTS.INSERT_REQUEST_TYPE) {
            updateRequired = true;
            if (typeof body.password !== 'string' || body.password.trim() === '') {
                return {
                    ok: false,
                    reason: `Please provide value for password in request body`
                };
            }
            if (!validatePassword(body.password, validationConfig.passwordMinLength)) {
                return {
                    ok: false,
                    reason: `Please provide valid password in request body. password should be at least ${validationConfig.passwordMinLength} characters long and should contain at least one capital letter, at least one small letter, at least one digit, at least one special character.`
                };
            }
            if (typeof body.confirmPassword !== 'string' || body.confirmPassword.trim() === '') {
                return {
                    ok: false,
                    reason: `Please provide value for confirmPassword in request body`
                };
            }
            if (body.password !== body.confirmPassword) {
                return {
                    ok: false,
                    reason: `confirmPassword should match with password`
                };
            }
        }

        delete body.userRole;

        const result = { ok: true };
        if (requestType === CONSTANTS.UPDATE_REQUEST_TYPE) {
            result.updateRequired = updateRequired;
        }
        return result;
    },

    validateEmail: (email) => {
        if (typeof email !== 'string' || email.trim() === '') {
            return {
                ok: false,
                reason: `Please provide string value for email in request body`
            };
        }
        if (!validateEmail(email)) {
            return {
                ok: false,
                reason: `Please provide valid email in request body`
            };
        }
        return { ok: true };
    },

    validateLoginBody: (body) => {
        if (typeof body.email !== 'string' || body.email.trim() === '') {
            return {
                ok: false,
                reason: `Please provide string value for email in request body`
            };
        }
        body.email = body.email.trim();
        if (!validateEmail(body.email)) {
            return {
                ok: false,
                reason: `Please provide valid email in request body`
            };
        }
        if (typeof body.password !== 'string' || body.password.trim() === '') {
            return {
                ok: false,
                reason: `Please provide value for password in request body`
            };
        }
        return { ok: true };
    },

    validateUserRole: (userRole) => {
        if (typeof userRole !== 'string'
            || !validationConfig.allowedUserRoles.includes(userRole)) {
            return {
                ok: false,
                reason: `Allowed userRoles are: ${validationConfig.allowedUserRoles}`
            };
        }
        return { ok: true };
    },

    validateProductBody: (body, requestType) => {
        requestType = requestType.toLowerCase();
        let updateRequired = false;
        if (requestType === CONSTANTS.INSERT_REQUEST_TYPE || body.name !== undefined) {
            updateRequired = true;
            if (typeof body.name !== 'string' || body.name.trim() === '') {
                return {
                    ok: false,
                    reason: `Please provide string value for name in request body`
                };
            }
            body.name = body.name.trim();
        }
        if (requestType === CONSTANTS.INSERT_REQUEST_TYPE || body.category !== undefined) {
            updateRequired = true;
            if (typeof body.category !== 'string' || body.category.trim() === '') {
                return {
                    ok: false,
                    reason: `Please provide string value for category in request body`
                };
            }
            body.category = body.category.trim();
        }
        if (requestType === CONSTANTS.INSERT_REQUEST_TYPE || body.availableQuantity !== undefined) {
            updateRequired = true;
            if (!(typeof body.availableQuantity === 'string' || typeof body.availableQuantity === 'number')) {
                return {
                    ok: false,
                    reason: `Please provide value for phone in request body`
                };
            }
            body.availableQuantity = parseInt(body.availableQuantity);
            if (!Number.isInteger(body.availableQuantity)) {
                return {
                    ok: false,
                    reason: `Please provide integer value for availableQuantity in request body`
                };
            }
            if (body.availableQuantity < validationConfig.productAvlblQtyMin || body.availableQuantity > validationConfig.productAvlblQtyMax) {
                return {
                    ok: false,
                    reason: `value for availableQuantity in request body should be an integer between ${validationConfig.productAvlblQtyMin} and ${validationConfig.productAvlblQtyMax}`
                };
            }
        }
        if (requestType === CONSTANTS.INSERT_REQUEST_TYPE || body.description !== undefined) {
            updateRequired = true;
            if (typeof body.description !== 'string' || body.description.trim() === '') {
                return {
                    ok: false,
                    reason: `Please provide string value for description in request body`
                };
            }
            body.description = body.description.trim();
            if (body.description.length < validationConfig.productDescMinLength) {
                return {
                    ok: false,
                    reason: `description in request body should be minimum ${validationConfig.productDescMinLength} characters long`
                };
            }
            if (body.description.length > validationConfig.productDescMaxLength) {
                return {
                    ok: false,
                    reason: `description in request body should be maximum ${validationConfig.productDescMaxLength} characters long`
                };
            }
        }
        if (requestType === CONSTANTS.INSERT_REQUEST_TYPE && body.storeId !== undefined) {
            updateRequired = true;
            if (!(typeof body.storeId === 'string' || typeof body.storeId === 'number')) {
                return {
                    ok: false,
                    reason: `Please provide value for storeId in request body`
                };
            }
            body.storeId = parseInt(body.storeId);
            if (!Number.isInteger(body.storeId)) {
                return {
                    ok: false,
                    reason: `Please provide integer value for storeId in request body`
                };
            }
        }

        const result = { ok: true };
        if (requestType === CONSTANTS.UPDATE_REQUEST_TYPE) {
            result.updateRequired = updateRequired;
        }
        return result;
    },

    validateStoreRequestBody: (body, requestType) => {
        if (typeof body.storeRequestType !== 'string' || body.storeRequestType.trim() === '') {
            return {
                ok: false,
                reason: `Please provide string value for storeRequestType in request body`
            };
        }
        if (!CONSTANTS.ALLOWED_STORE_REQUEST_TYPES.includes(body.storeRequestType)) {
            return {
                ok: false,
                reason: `Allowed storeRequestType in request body: ${CONSTANTS.ALLOWED_STORE_REQUEST_TYPES}`
            };
        }
        let updateRequired = false;
        if ((requestType === CONSTANTS.INSERT_REQUEST_TYPE && body.storeRequestType === CONSTANTS.INSERT_REQUEST_TYPE) || body.name !== undefined) {
            updateRequired = true;
            if (typeof body.name !== 'string' || body.name.trim() === '') {
                return {
                    ok: false,
                    reason: `Please provide string value for name in request body`
                };
            }
            body.name = body.name.trim();
        }
        if ((requestType === CONSTANTS.INSERT_REQUEST_TYPE && body.storeRequestType === CONSTANTS.INSERT_REQUEST_TYPE) || body.location !== undefined) {
            updateRequired = true;
            if (typeof body.location !== 'string' || body.location.trim() === '') {
                return {
                    ok: false,
                    reason: `Please provide string value for location in request body`
                };
            }
            body.location = body.location.trim();
        }
        if ((requestType === CONSTANTS.INSERT_REQUEST_TYPE && body.storeRequestType === CONSTANTS.INSERT_REQUEST_TYPE) || body.phone !== undefined) {
            updateRequired = true;
            if (!(typeof body.phone === 'string' || typeof body.phone === 'number')) {
                return {
                    ok: false,
                    reason: `Please provide value for phone in request body`
                };
            }
            body.phone = parseInt(body.phone);
            if (!Number.isInteger(body.phone)) {
                return {
                    ok: false,
                    reason: `Please provide integer value for phone in request body`
                };
            }
            if (('' + body.phone).length != validationConfig.phoneLength) {
                return {
                    ok: false,
                    reason: `Please provide ${validationConfig.phoneLength}-digit integer value for phone in request body`
                };
            }
        }

        const result = { ok: true };
        if (requestType === CONSTANTS.UPDATE_REQUEST_TYPE || body.storeRequestType === CONSTANTS.UPDATE_REQUEST_TYPE) {
            result.updateRequired = updateRequired;
        }
        return result;
    },

    validateStoreRequestRejectBody: (body) => {
        if (typeof body.rejectReason !== 'string' || body.rejectReason.trim() === '') {
            return reject({
                ok: false,
                reason: `Please provide string value for rejectReason in request body`
            });
        }
        if (body.rejectReason.length < validationConfig.rejectReasonMinLength) {
            return reject({
                ok: false,
                reason: `rejectReason in request body should be at least ${validationConfig.rejectReasonMinLength} characters long`
            });
        }
        return { ok: true };
    }
};