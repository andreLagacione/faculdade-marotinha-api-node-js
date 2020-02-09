const mongoose = require('mongoose');

const turmaSchema = new mongoose.Schema({
    ano: String,
    curso: String,
    professor: String,
    periodo: String
}, {
    collection: 'turmas'
});

module.exports = turmaSchema;