const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
    name: String,
    materias: Array
}, {
    collection: 'cursos'
});

module.exports = cursoSchema;