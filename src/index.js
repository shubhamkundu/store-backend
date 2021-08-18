// connecting .env file to process.env
require('dotenv').config();

// import dependencies
const express = require('express');

// import local dependencies
require('./error-handler');
const { db } = require('./db');
const { storeRouter } = require('./routes')({ db });

// initialize express app
const app = express();

// use middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// use router middlewares
app.use('/store', storeRouter);

// run server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`store-backend server is listening on port: ${port}`);
});