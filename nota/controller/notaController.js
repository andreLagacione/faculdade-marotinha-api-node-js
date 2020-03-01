const db = require('../../mongo-config');
const schema = require('../schema');
const { pagination, paginationParams } = require('../../commons/pagination');
const model = db.model('notas', schema, 'notas', true);
const materiaModel = db.model('materias');
const ObjectId = require('mongodb').ObjectID;
const { convertId, structureArrayOfObjectId } = require('../../commons/convert-id');
const { checkCpf, findRegisterByCpf } = require('../../commons/cpf');
const { validateIfHasSubjects } = require('../../commons/validators');

module.exports = {
    async index(request, response) {
        const notas = await model.find({ idBoletim: ObjectId(request.param.id) });
        console.log(notas);

        response.json(notasDTO(notas));
    },

    show(request, response) {
        return response.json({ status: 'OK' });
    }
};

const notasDTO = (notas) => {
    let listDTO = [];

    notas.map(item => {
        listDTO.push({
            nomeMateria: item.materia,
            notaBimestre1,
            notaBimestre2,
            notaBimestre3,
            notaBimestre4,
            notaBimestre4,
            mediaFinal
        });
    });

    return listDTO;
};