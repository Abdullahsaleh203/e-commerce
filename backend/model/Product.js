import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String, enum: ['electronics', 'fashion', 'books'] },
    stock: { type: Number, default: 0 },
    imageUrl: { type: String }
});

productSchema.pre('save', function(next) {
    if (this.stock < 0) {
        this.stock = 0;
    }
    next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
