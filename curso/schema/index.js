const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
    nome: String,
    materias: Array
}, {
    collection: 'cursos'
});

module.exports = cursoSchema;