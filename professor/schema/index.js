const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
    name: String,
    age: Number,
    cpf: String,
    phone: String,
    materiasLecionadas: Array
}, {
    collection: 'professores'
});

module.exports = professorSchema;