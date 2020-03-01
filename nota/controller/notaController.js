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
        response.json(notasDTO(notas));
    },

    async store(request, response) {
        const { idMateria, notaBimestre1, notaBimestre2, notaBimestre3, notaBimestre4, idBoletim } = request.body;
        const canAdd = await findNota(request);

        if (canAdd.length) {
            response.json({
                httpStatus: 'Method Not Allowed',
                httpStatusCode: 405,
                message: 'Já existe um registro cadastrado com esses dados!'
            });

            return false;
        }

        // CONTINUAR ESSE METODO


        const newProfessor = new model({
            name: request.body.name.trim(),
            age: request.body.age,
            cpf: cpf,
            phone: request.body.phone.trim(),
            materias: request.body.materias
        });

        const save = await newProfessor.save();

        response.json({
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Professor(a) adicionado(a) com sucesso!'
        });
    },
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

const findNota = async (request) => {
    const { idMateria, idBoletim } = request.body;

    return await model.find({
        idMateria: ObjectId(idMateria),
        idBoletim: ObjectId(idBoletim)
    });
}