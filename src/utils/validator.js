module.exports = {
    validateId: (idName, idStr, location) => {
        if (idStr == null) {
            return {
                ok: false,
                reason: `Please provide ${idName} in request ${location}`
            }
        }
        const id = parseInt(idStr);
        if (isNaN(id) || id <= 0) {
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

    validateStoreBody: (body) => {
        if (typeof body.name !== 'string' || body.name.trim() === '') {
            return {
                ok: false,
                reason: `Please provide string value for name in request body`
            };
        }
        if (typeof body.location !== 'string' || body.location.trim() === '') {
            return {
                ok: false,
                reason: `Please provide string value for location in request body`
            };
        }
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
        if (('' + body.phone).length != 10) {
            return {
                ok: false,
                reason: `Please provide 10-digit integer value for phone in request body`
            };
        }
        return { ok: true };
    },

    validateStoreUpdateObj: (body) => {
        if (body.name !== undefined) {
            if (typeof body.name !== 'string' || body.name.trim() === '') {
                return {
                    ok: false,
                    reason: `Please provide string value for name in request body`
                };
            }
        }
        if (body.location !== undefined) {
            if (typeof body.location !== 'string' || body.location.trim() === '') {
                return {
                    ok: false,
                    reason: `Please provide string value for location in request body`
                };
            }
        }
        if (body.phone !== undefined) {
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
            if (('' + body.phone).length != 10) {
                return {
                    ok: false,
                    reason: `Please provide 10-digit integer value for phone in request body`
                };
            }
        }
        return { ok: true };
    }
};