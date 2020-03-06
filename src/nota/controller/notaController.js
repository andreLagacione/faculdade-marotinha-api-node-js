const db = require('../../mongo-config');
const schema = require('../schema');
const model = db.model('notas', schema, 'notas', true);
const ObjectId = require('mongodb').ObjectID;
const { getById } = require('../../commons/getData');
const { removeData } = require('../../commons/removeData');

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
            notaBimestre1: notaBimestre1.toPrecision(2),
            notaBimestre2: notaBimestre2.toPrecision(2),
            notaBimestre3: notaBimestre3.toPrecision(2),
            notaBimestre4: notaBimestre4.toPrecision(2),
            mediaFinal: mediaCalculate(notaBimestre1, notaBimestre2, notaBimestre3, notaBimestre4)
        });

        const save = await newProfessor.save();

        response.json({
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Nota adicionado com sucesso!'
        });
    },

    async show(request, response) {
        const _id = request.params.id;
        const nota = await model.findById(_id).lean().exec();

        if (nota) {
            response.setHeader('Content-Type', 'application/json');
            response.json({
                idMateria: nota.materia,
                notaBimestre1: nota.notaBimestre1,
                notaBimestre2: nota.notaBimestre2,
                notaBimestre3: nota.notaBimestre3,
                notaBimestre4: nota.notaBimestre4
            });
            return false;
        }

        response.status(404).send({
            httpStatus: 'Not Found',
            httpStatusCode: 404,
            message: 'Notas não encontradas!'
        });
    },

    async update(request, response) {
        const {
            id, idMateria, notaBimestre1, notaBimestre2, notaBimestre3, notaBimestre4, idBoletim
        } = request.body;

        const canEdit = await findNota(request);

        if (canEdit.length && canEdit[0]._id != id) {
            response.status(405).send({
                httpStatus: 'Method Not Allowed',
                httpStatusCode: 405,
                message: 'Já existe(m) nota(s) cadastrada(s) para essa matéria neste boletim!'
            });

            return false;
        }

        const _response = await model.updateOne({
            _id: id
        }, {
            $set: {
                materia: idMateria,
                idBoletim,
                notaBimestre1: notaBimestre1.toPrecision(2),
                notaBimestre2: notaBimestre2.toPrecision(2),
                notaBimestre3: notaBimestre3.toPrecision(2),
                notaBimestre4: notaBimestre4.toPrecision(2),
                mediaFinal: mediaCalculate(notaBimestre1, notaBimestre2, notaBimestre3, notaBimestre4)
            }
        });

        if (_response && _response.n === 0) {
            response.status(404).send({
                httpStatus: 'Not Found',
                httpStatusCode: 404,
                message: 'Nota não encontrada!'
            });

            return false;
        }

        response.json({
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Nota alterada com sucesso!'
        });
    },

    async destroy(request, response) {
        return removeData(response, model, request.params.id, 'Nota removida com sucesso!', 'Nota não encontrada!');
    }
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