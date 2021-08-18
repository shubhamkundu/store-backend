const mongoose = require('mongoose');
require('./connection')(mongoose);
require('./models')(mongoose);

module.exports = {
    db: mongoose.connection
};