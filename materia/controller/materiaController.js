const db = require('../../mongo-config');
const schema = require('../schema');
const { pagination, paginationParams } = require('../../commons/pagination');
const model = db.model('materias', schema, 'materias', true);
const ObjectId = require('mongodb').ObjectID;
const { convertId } = require('../../commons/convert-id');

module.exports = {
    async index(request, response) {
        const _paginationParams = paginationParams(request);
        const materiaList = await model.find({}).sort([[_paginationParams.orderBy, _paginationParams.direction]]).lean().exec();
        let _pagination = pagination(_paginationParams.pageNumber, _paginationParams.pageSize, materiaList)
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

        if (_response && _response.nModified === 0) {
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
        const _id = request.params.id;

        const _response = await model.deleteOne({
            '_id': new ObjectId(_id)
        });

        if (_response && _response.deletedCount === 0) {
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
            message: 'Matéria removida com sucesso!'
        });
    }
}