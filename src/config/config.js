const DEFAULT = {
    DB_USERNAME: '',
    DB_PASSWORD: '',
    DB_HOST: '',
    DB_PORT: '',
    DB_DBNAME: '',
    PHONE_LENGTH: 10,
    PASSWORD_MIN_LENGTH: 8,
    PRODUCT_DESC_MIN_LENGTH: 10,
    PRODUCT_DESC_MIN_LENGTH: 1000,
    PRODUCT_AVLBL_QTY_MIN: 0,
    PRODUCT_AVLBL_QTY_MAX: 99999,
    ALLOWED_USER_ROLES: ['subuser', 'admin'],
    BCRYPT_SALT_WORK_FACTOR: 10,
    JWT_SECRET: '',
    JWT_EXPIRES_IN: ''
};

module.exports = {
    db: {
        username: process.env.DB_USERNAME || DEFAULT.DB_USERNAME,
        password: process.env.DB_PASSWORD || DEFAULT.DB_PASSWORD,
        host: process.env.DB_HOST || DEFAULT.DB_HOST,
        port: process.env.DB_PORT || DEFAULT.DB_PORT,
        dbname: process.env.DB_DBNAME || DEFAULT.DB_DBNAME
    },
    validation: {
        phoneLength: process.env.PHONE_LENGTH || DEFAULT.PHONE_LENGTH,
        passwordMinLength: process.env.PASSWORD_MIN_LENGTH || DEFAULT.PASSWORD_MIN_LENGTH,
        productDescMinLength: process.env.PRODUCT_DESC_MIN_LENGTH || DEFAULT.PRODUCT_DESC_MIN_LENGTH,
        productDescMaxLength: process.env.PRODUCT_DESC_MAX_LENGTH || DEFAULT.PRODUCT_DESC_MAX_LENGTH,
        productAvlblQtyMin: process.env.PRODUCT_AVLBL_QTY_MIN || DEFAULT.PRODUCT_AVLBL_QTY_MIN,
        productAvlblQtyMax: process.env.PRODUCT_AVLBL_QTY_MAX || DEFAULT.PRODUCT_AVLBL_QTY_MAX,
        allowedUserRoles:
            process.env.ALLOWED_USER_ROLES
                ? process.env.ALLOWED_USER_ROLES.split(',')
                : DEFAULT.ALLOWED_USER_ROLES
    },
    encryption: {
        bcryptSaltWorkFactor:
            isFinite(process.env.BCRYPT_SALT_WORK_FACTOR)
                ? parseInt(process.env.BCRYPT_SALT_WORK_FACTOR)
                : DEFAULT.BCRYPT_SALT_WORK_FACTOR,
        jwtSecret: process.env.JWT_SECRET || DEFAULT.JWT_SECRET,
        jwtExpiresIn: process.env.JWT_EXPIRES_IN || DEFAULT.JWT_EXPIRES_IN
    }
};