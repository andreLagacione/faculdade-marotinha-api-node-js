const db = require('../../mongo-config');
const schema = require('../schema');
const { pagination, paginationParams } = require('../../commons/pagination');
const model = db.model('notas', schema, 'notas', true);
const materiaModel = db.model('materias');
const ObjectId = require('mongodb').ObjectID;
const { convertId, structureArrayOfObjectId } = require('../../commons/convert-id');
const { checkCpf, findRegisterByCpf } = require('../../commons/cpf');
const { validateIfHasSubjects } = require('../../commons/validators');
const { getById } = require('../../commons/getData');

module.exports = {
    async index(request, response) {
        const notas = await model.find({ idBoletim: ObjectId(request.params.id) });
        response.json(await notasDTO(notas));
    },

    async store(request, response) {
        const { idMateria, notaBimestre1, notaBimestre2, notaBimestre3, notaBimestre4, idBoletim } = request.body;
        const canAdd = await findNota(request);

        if (canAdd.length) {
            response.status(405).send({
                httpStatus: 'Method Not Allowed',
                httpStatusCode: 405,
                message: 'Já existe(m) nota(s) cadastrada(s) para essa matéria neste boletim!'
            });

            return false;
        }

        const newProfessor = new model({
            materia: idMateria,
            idBoletim,
            notaBimestre1,
            notaBimestre2,
            notaBimestre3,
            notaBimestre4,
            mediaFinal: mediaCalculate(notaBimestre1, notaBimestre2, notaBimestre3, notaBimestre4)
        });

        const save = await newProfessor.save();

        response.json({
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Nota adicionado com sucesso!'
        });
    },
};

const notasDTO = async notas => {
    let listDTO = [];

    await Promise.all(
        notas.map(async item => {
            const materia = await getById(`/materia/${item.materia}`);

            listDTO.push({
                id: item._id,
                nomeMateria: materia.name,
                notaBimestre1: item.notaBimestre1,
                notaBimestre2: item.notaBimestre2,
                notaBimestre3: item.notaBimestre3,
                notaBimestre4: item.notaBimestre4,
                mediaFinal: item.mediaFinal || 'N/A'
            });
        })
    );

    return listDTO;
};

const findNota = async (request) => {
    const { idMateria, idBoletim } = request.body;

    return await model.find({
        materia: ObjectId(idMateria),
        idBoletim: ObjectId(idBoletim)
    });
}

const mediaCalculate = (notaBimestre1, notaBimestre2, notaBimestre3, notaBimestre4) => {
    if (notaBimestre1 && notaBimestre2 && notaBimestre3 && notaBimestre4) {
        const media = (notaBimestre1 + notaBimestre2 + notaBimestre3 + notaBimestre4) / 4;
        return media.toPrecision(2);
    }

    return 0;
}