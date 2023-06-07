const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: {
            values: ['crypto-waller', 'credit-card', 'debit-card', 'paypal'],
            message: 'Payment method is not valid!',
        },
        required: true,
    },
    purchasedBy: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    owner: {type: mongoose.Types.ObjectId, ref: 'User'}
});

const Crypto = mongoose.model('Crypto', cryptoSchema);

module.exports = Crypto;
