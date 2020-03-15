const mongoose = require('mongoose');

const alunoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        trim: true
    },
    cpf: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    turmas: [{
        type: String,
        required: true,
        trim: true
    }]
}, {
    collection: 'alunos'
});

module.exports = alunoSchema;