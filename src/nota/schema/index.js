const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notaSchema = new mongoose.Schema({
    materia: {
        type: Schema.Types.ObjectId,
        ref: 'Materias'
    },
    idBoletim: {
        type: Schema.Types.ObjectId,
        ref: 'Boletim'
    },
    notaBimestre1: Number,
    notaBimestre2: Number,
    notaBimestre3: Number,
    notaBimestre4: Number,
    mediaFinal: Number
}, {
    collection: 'notas'
});

module.exports = notaSchema;