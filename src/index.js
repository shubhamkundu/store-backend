// connecting .env file to process.env
require('dotenv').config();

// import dependencies
const express = require('express');

// import local dependencies
require('./utils/error-handler');
const { verifyToken } = require('./utils/lib');
const { db } = require('./db');
const { authRouter, adminRouter, storeRouter, userRouter, productRouter } = require('./routes')({ db });

// initialize express app
const app = express();

// use middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// use router middlewares
app.use('/auth', authRouter);
app.use('/store', verifyToken, storeRouter);
app.use('/user', verifyToken, userRouter);
app.use('/product', verifyToken, productRouter);

// run server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`store-backend server is listening on port: ${port}`);
});