const mongoose = require('mongoose');

const User = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    dp: {
        type: String,
    },
    connections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
});

module.exports = mongoose.model('User', User);
