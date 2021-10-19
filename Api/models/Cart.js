import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const cartSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    products: [
        {
            productId:{
                String,
            },
        quantity: {
            type: Number,
            default: 1,
        },
    },
    ],
    
},{timestamps: true})

export default model('cart', cartSchema);