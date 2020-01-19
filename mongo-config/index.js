const mongoose = require('mongoose');
mongoose.connect(
    'mongodb://localhost:27017/faculdade_marotinha',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

module.exports = mongoose;