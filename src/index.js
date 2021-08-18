const express = require('express');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`store-backend server is listening on port: ${port}`);
});