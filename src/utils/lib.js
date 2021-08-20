const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const encryptionConfig = require('./../config/config').encryption;

const self = module.exports = {
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

    comparePassword: (actualPlaintextPassword, expectedHashedPassword) =>
        new Promise((resolve, reject) => {
            bcrypt.compare(actualPlaintextPassword, expectedHashedPassword, (err, isMatch) => {
                if (err) return reject(err);
                resolve(isMatch);
            });
        }),

    copyPropsFromObj: (propArr, obj) => {
        const newObj = {};
        for (const prop of propArr) {
            newObj[prop] = obj[prop];
        }
        return newObj;
    },

    generateToken: (payload) => {
        const options = {};
        if (!!encryptionConfig.jwtExpiresIn) options.expiresIn = encryptionConfig.jwtExpiresIn;
        const token = jwt.sign(payload, encryptionConfig.jwtSecret, options);
        return token;
    },

    verifyToken: (req, res, next) => {
        if (typeof req.headers.token !== 'string' || req.headers.token.trim() === '') {
            return self.handleAPIError(req, res, {
                statusCode: 401,
                errorMessage: `Please provide token in request headers`
            });
        }
        let user;
        try {
            user = jwt.verify(req.headers.token, encryptionConfig.jwtSecret);
        } catch (e) {
            return self.handleAPIError(req, res, {
                statusCode: 401,
                errorMessage: `Invalid token in request header`
            });
        }
        req.user = user;
        next();
    },

    generateUserObj: (loggedInUser) => {
        const userObj = {};
        userObj.userId = loggedInUser.userId;
        userObj.name = loggedInUser.name;
        userObj.email = loggedInUser.email;
        userObj.userRole = loggedInUser.userRole;
    },

    verifyAdmin: (req, res, next) => {
        if (req.user.userRole !== 'admin') {
            return self.handleAPIError(req, res, {
                statusCode: 403,
                errorMessage: `Access denied`
            });
        }
        next();
    }
};