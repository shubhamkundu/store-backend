const validationConfig = require('./../config/config').validation;
const { validateEmail, validatePassword } = require('./../utils/lib');

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
        if (requestType === 'insert' || body.name !== undefined) {
            updateRequired = true;
            if (typeof body.name !== 'string' || body.name.trim() === '') {
                return {
                    ok: false,
                    reason: `Please provide string value for name in request body`
                };
            }
        }
        if (requestType === 'insert' || body.location !== undefined) {
            updateRequired = true;
            if (typeof body.location !== 'string' || body.location.trim() === '') {
                return {
                    ok: false,
                    reason: `Please provide string value for location in request body`
                };
            }
        }
        if (requestType === 'insert' || body.phone !== undefined) {
            updateRequired = true;
            if (typeof body.phone !== 'string' || body.phone.trim() === '') {
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
                    reason: `Please provide 10-digit integer value for phone in request body`
                };
            }
        }
        if (requestType === 'insert' || body.storeOwner !== undefined) {
            updateRequired = true;
            if (typeof body.storeOwner !== 'string' || body.storeOwner.trim() === '') {
                return {
                    ok: false,
                    reason: `Please provide value for storeOwner in request body`
                };
            }
            body.storeOwner = parseInt(body.storeOwner);
            if (!Number.isInteger(body.storeOwner)) {
                return {
                    ok: false,
                    reason: `Please provide integer value for storeOwner in request body`
                };
            }
        }

        const result = { ok: 1 };
        if (requestType === 'update') {
            result.updateRequired = updateRequired;
        }
        return result;
    },

    validateUserBody: (body, requestType) => {
        let updateRequired = false;
        if (requestType === 'insert' || body.name !== undefined) {
            updateRequired = true;
            if (typeof body.name !== 'string' || body.name.trim() === '') {
                return {
                    ok: false,
                    reason: `Please provide string value for name in request body`
                };
            }
        }
        if (requestType === 'insert' || body.email !== undefined) {
            updateRequired = true;
            if (typeof body.email !== 'string' || body.email.trim() === '') {
                return {
                    ok: false,
                    reason: `Please provide string value for email in request body`
                };
            }
            if (!validateEmail(body.email)) {
                return {
                    ok: false,
                    reason: `Please provide valid email in request body`
                };
            }
        }
        if (requestType === 'insert') {
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

        const result = { ok: 1 };
        if (requestType === 'update') {
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
        if (requestType === 'insert' || body.name !== undefined) {
            updateRequired = true;
            if (typeof body.name !== 'string' || body.name.trim() === '') {
                return {
                    ok: false,
                    reason: `Please provide string value for name in request body`
                };
            }
        }
        if (requestType === 'insert' || body.category !== undefined) {
            updateRequired = true;
            if (typeof body.category !== 'string' || body.category.trim() === '') {
                return {
                    ok: false,
                    reason: `Please provide string value for category in request body`
                };
            }
        }
        if (requestType === 'insert' || body.availableQuantity !== undefined) {
            updateRequired = true;
            if (typeof body.availableQuantity !== 'string' || body.availableQuantity.trim() === '') {
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
        }
        if (requestType === 'insert' || body.description !== undefined) {
            updateRequired = true;
            if (typeof body.description !== 'string' || body.description.trim() === '') {
                return {
                    ok: false,
                    reason: `Please provide string value for description in request body`
                };
            }
        }
        if (requestType === 'insert' && body.storeId !== undefined) {
            updateRequired = true;
            if (typeof body.storeId !== 'string' || body.storeId.trim() === '') {
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

        const result = { ok: 1 };
        if (requestType === 'update') {
            result.updateRequired = updateRequired;
        }
        return result;
    }
};