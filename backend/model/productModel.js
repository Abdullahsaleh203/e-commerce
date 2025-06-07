import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
    name: {
        type: String, required: [true, 'Product name is required'],
        trim: true, minlength: [3, 'Product name must be at least 3 characters long'],
    },
    price: {
        type: Number, required: true,
        min: [0, 'Price must be a positive number']
    },
    description: {
        type: String, required: true
    },
    category: {
        type: String, enum: ['electronics', 'fashion', 'books'],
        required: [true, 'Category is required'],
    },
    stock: {
        type: Number, default: 0
    },
    image: {
        type: String,
        required: [true, 'Image  is required']
    },
    isFeatured: {
        type: Boolean, default: false
    },
    sold: {
        type: Number, default: 0
    },
    reviews: {
        type: Number, default: 0
    },
    ratings: {
        type: Number, default: 0
    },
},// time stamps will automatically add createdAt and updatedAt fields
    { timestamps: true });

productSchema.pre('save', function (next) {
    if (this.stock < 0) {
        this.stock = 0;
    }
    next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
