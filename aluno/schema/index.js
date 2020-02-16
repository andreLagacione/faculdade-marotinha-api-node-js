const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
    name: String,
    age: Number,
    cpf: String,
    phone: String,
    turmas: Array
}, {
    collection: 'alunos'
});

module.exports = professorSchema;