const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boletimSchema = new mongoose.Schema({
    ano: Number,
    professor: {
        type: Schema.Types.ObjectId,
        ref: 'Professores'
    },
    aluno: {
        type: Schema.Types.ObjectId,
        ref: 'Alunos'
    },
    turma: {
        type: Schema.Types.ObjectId,
        ref: 'Turmas'
    }
}, {
    collection: 'boletim'
});

module.exports = boletimSchema;