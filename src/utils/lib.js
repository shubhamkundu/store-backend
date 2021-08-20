const bcrypt = require('bcrypt');
const encryptionConfig = require('./../config/config').encryption;

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
    },

    preSaveUser: function (next) {
        const user = this;

        // generate a salt
        bcrypt.genSalt(encryptionConfig.bcryptSaltWorkFactor, (err, salt) => {
            if (err) return next(err);

            // hash the password using our new salt
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err);
                // override the cleartext password with the hashed one
                user.password = hash;
                next();
            });
        });
    },

    comparePassword: function (candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
            if (err) return cb(err);
            cb(null, isMatch);
        });
    }
};