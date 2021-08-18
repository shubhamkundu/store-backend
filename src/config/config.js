module.exports = {
    db: {
        username: process.env.DB_USERNAME || '',
        password: process.env.DB_PASSWORD || '',
        host: process.env.DB_HOST || '',
        port: process.env.DB_PORT || '',
        dbname: process.env.DB_DBNAME || ''
    }
};