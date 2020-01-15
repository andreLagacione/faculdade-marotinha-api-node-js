const mongoose = require('mongoose');

const materiaSchema = new mongoose.Schema({
    name: String
}, {
    collection: 'materias'
});

module.exports = materiaSchema;