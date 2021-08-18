const dbConfig = require('./../config/config').db;
const mongoURI = `mongodb://${encodeURIComponent(dbConfig.username)}:${encodeURIComponent(dbConfig.password)}@${dbConfig.host}:${dbConfig.port}/${dbConfig.dbname}`;

module.exports = (mongoose) => {
    try {
        (async () => {
            await mongoose.connect(
                mongoURI,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                }
            );
        })();
    } catch (error) {
        console.error(error);
    }

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log(`Connected to MongoDB`);
    });
};