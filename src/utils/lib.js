module.exports = {
    handleAPIError: (req, res, err) => {
        console.error(`${req.method} ${req.originalUrl} API error:`, err);
        res
            .status(
                err.statusCode
                    ? err.statusCode
                    : 500
            )
            .send(
                err.errorMessage
                    ? (
                        err.errorMessage.stack
                            ? err.errorMessage.stack
                            : err.errorMessage
                    )
                    : err.stack
            );
    },

    validateEmail: (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },

    validatePassword: (password, passwordMinLength) => {
        return /[A-Z]/.test(password) // at least one capital letter
            && /[a-z]/.test(password) // at least one small letter
            && /[0-9]/.test(password) // at least one digit
            && /[^A-Za-z0-9]/.test(password) // at least one special character
            && password.length >= passwordMinLength;  // min length
    }
};