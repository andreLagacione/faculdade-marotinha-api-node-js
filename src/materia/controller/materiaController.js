const db = require('../../mongo-config');
const schema = require('../schema');
const { buildPagination } = require('../../commons/pagination');
const model = db.model('materias', schema, 'materias', true);
const { convertId } = require('../../commons/convert-id');
const { removeData } = require('../../commons/removeData');

module.exports = {
    async index(request, response) {
        let _pagination = await buildPagination(request, model);
        _pagination.content = convertId(_pagination.content);
        response.json(_pagination);
    },

    async store(request, response) {
        const newMateria = new model({
            name: request.body.name.trim()
        });

        const save = await newMateria.save();

        response.json({
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Matéria adicionada com sucesso!'
        });
    },

    async show(request, response) {
        const _id = request.params.id;
        const materia = await model.findById(_id).lean().exec();

        if (materia) {
            response.setHeader('Content-Type', 'application/json');
            response.json(convertId([materia])[0]);
            return false;
        }

        response.status(404).send({
            httpStatus: 'Not Found',
            httpStatusCode: 404,
            message: 'Matéria não encontrada!'
        });
    },

    async update(request, response) {
        const _id = request.body.id;
        const oldElement = { _id: _id };
        const newValue = {
            name: request.body.name.trim()
        };

        const _response = await model.updateOne(oldElement, newValue);

        if (_response && _response.n === 0) {
            response.status(404).send({
                httpStatus: 'Not Found',
                httpStatusCode: 404,
                message: 'Matéria não encontrada!'
            });

            return false;
        }

        response.json({
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Matéria alterada com sucesso!'
        });
    },

    async destroy(request, response) {
        return removeData(response, model, request.params.id, 'Matéria não encontrada!', 'Matéria removida com sucesso!');
    }
}