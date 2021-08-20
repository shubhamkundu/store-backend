const { preSaveUser, comparePassword } = require('./../utils/lib');

module.exports = (mongoose) => {
    const adminSchema = new mongoose.Schema({
        adminId: { type: Number, required: true, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        createdOn: { type: String, required: true },
        updatedOn: { type: String }
    });
    adminSchema.pre('save', preSaveUser);
    adminSchema.methods.comparePassword = comparePassword;

    const storeSchema = new mongoose.Schema({
        storeId: { type: Number, required: true, unique: true },
        name: { type: String, required: true },
        location: { type: String, required: true, unique: true },
        phone: { type: Number, required: true, unique: true },
        createdOn: { type: String, required: true },
        updatedOn: { type: String }
    });

    const userSchema = new mongoose.Schema({
        userId: { type: Number, required: true, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        createdOn: { type: String, required: true },
        updatedOn: { type: String }
    });
    userSchema.pre('save', preSaveUser);
    userSchema.methods.comparePassword = comparePassword;

    const productSchema = new mongoose.Schema({
        productId: { type: Number, required: true, unique: true },
        name: { type: String, required: true, unique: true },
        category: { type: String, required: true },
        availableQuantity: { type: Number, required: true, min: 0 },
        description: { type: String },
        createdOn: { type: String, required: true },
        updatedOn: { type: String }
    });

    mongoose.model('Admin', adminSchema);
    mongoose.model('Store', storeSchema);
    mongoose.model('User', userSchema);
    mongoose.model('Product', productSchema);
};
