const { preSaveUser } = require('./../utils/lib');

module.exports = (mongoose) => {
    const storeSchema = new mongoose.Schema({
        storeId: { type: Number, required: true, unique: true },
        name: { type: String, required: true },
        location: { type: String, required: true },
        phone: { type: Number, required: true },
        storeOwnerId: { type: Number, required: true, unique: true }, // one person can have only one store
        createdOn: { type: String, required: true },
        createdBy: { type: Number, required: true },
        updatedOn: { type: String },
        updatedBy: { type: Number },
        isDeleted: { type: Boolean, default: false },
        deletedOn: { type: String },
        deletedBy: { type: Number }
    });

    const userSchema = new mongoose.Schema({
        userId: { type: Number, required: true, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        userRole: { type: String, default: 'subUser' },
        storeId: { type: Number },
        storeRequestId: { type: Number },
        createdOn: { type: String, required: true },
        updatedOn: { type: String },
        updatedBy: { type: Number },
        isDeleted: { type: Boolean, default: false },
        deletedOn: { type: String },
        deletedBy: { type: Number }
    });
    userSchema.pre('save', preSaveUser);

    const productSchema = new mongoose.Schema({
        productId: { type: Number, required: true, unique: true },
        name: { type: String, required: true },
        category: { type: String, required: true },
        availableQuantity: { type: Number, required: true },
        description: { type: String },
        storeId: { type: Number, required: true },
        createdOn: { type: String, required: true },
        createdBy: { type: Number, required: true },
        updatedOn: { type: String },
        updatedBy: { type: Number },
        isDeleted: { type: Boolean, default: false },
        deletedOn: { type: String },
        deletedBy: { type: Number }
    });

    const categorySchema = new mongoose.Schema({
        categoryId: { type: String, required: true, unique: true },
        categoryName: { type: String, required: true, unique: true }
    });

    const storeRequestSchema = new mongoose.Schema({
        storeRequestId: { type: Number, required: true, unique: true },
        storeId: { type: Number },
        storeOwnerId: { type: Number },
        name: { type: String, required: true },
        location: { type: String, required: true },
        phone: { type: Number, required: true },
        storeRequestType: { type: String, required: true }, // insert/update
        storeRequestStatus: { type: String, required: true }, // pending/approved/rejected
        createdOn: { type: String, required: true },
        createdBy: { type: Number, required: true },
        updatedOn: { type: String },
        updatedBy: { type: Number },
        approvedOn: { type: String },
        approvedBy: { type: Number },
        rejectReason: { type: String },
        rejectedOn: { type: String },
        rejectedBy: { type: Number },
        isDeleted: { type: Boolean, default: false },
        deletedOn: { type: String },
        deletedBy: { type: Number }
    });

    mongoose.model('Store', storeSchema);
    mongoose.model('User', userSchema);
    mongoose.model('Product', productSchema);
    mongoose.model('Category', categorySchema);
    mongoose.model('StoreRequest', storeRequestSchema);
};
