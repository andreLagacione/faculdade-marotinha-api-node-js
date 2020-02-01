const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
    name: String,
    age: Number,
    cpf: String,
    phone: Number,
    materiasLecionadas: Array,
    boletins: Array,
    turmas: Array
}, {
    collection: 'professores'
});