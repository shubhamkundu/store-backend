module.exports = {
    db: {
        username: process.env.DB_USERNAME || '',
        password: process.env.DB_PASSWORD || '',
        host: process.env.DB_HOST || '',
        port: process.env.DB_PORT || '',
        dbname: process.env.DB_DBNAME || ''
    },
    validation: {
        phoneLength: process.env.PHONE_LENGTH || 10,
        passwordMinLength: process.env.PASSWORD_MIN_LENGTH || 8,
        allowedUserRoles:
            process.env.ALLOWED_USER_ROLES
                ? process.env.ALLOWED_USER_ROLES.split(',')
                : ['subuser', 'admin']
    },
    encryption: {
        bcryptSaltWorkFactor:
            isFinite(process.env.BCRYPT_SALT_WORK_FACTOR)
                ? parseInt(process.env.BCRYPT_SALT_WORK_FACTOR)
                : 10
    }
};