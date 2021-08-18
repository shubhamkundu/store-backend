module.exports = (mongoose) => {
    const adminSchema = new mongoose.Schema({
        adminId:  {
            type: Number,
            required: true,
            unique: true
        },
        name: String,
        email: String,
        password: String
    });
    const storeSchema = new mongoose.Schema({
        storeId:  {
            type: Number,
            required: true,
            unique: true
        },
        name: String,
        location: String,
        phone: Number
    });
    const subUserSchema = new mongoose.Schema({
        subUserId:  {
            type: Number,
            required: true,
            unique: true
        },
        name: String,
        email: String,
        password: String
    });
    const productSchema = new mongoose.Schema({
        productId: {
            type: Number,
            required: true,
            unique: true
        },
        name: String,
        category: String,
        availableQuantity: Number,
        description: String
    });

    mongoose.model('Admin', adminSchema);
    mongoose.model('Store', storeSchema);
    mongoose.model('SubUser', subUserSchema);
    mongoose.model('Product', productSchema);
};
