const mongoose = require('mongoose');

const turmaSchema = new mongoose.Schema({
    ano: String,
    curso: String,
    cursoName: String,
    professor: String,
    professorName: String,
    periodo: String
}, {
    collection: 'turmas'
});

module.exports = turmaSchema;