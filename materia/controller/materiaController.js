const db = require('../../mongo-config');
const schema = require('../schema');
const { pagination } = require('../../commons/pagination');
const model = db.model('materias', schema, 'materias');
const ObjectId = require('mongodb').ObjectID;
const { convertId } = require('../../commons/convert-id');

module.exports = {
    async index(request, response) {
        const pageNumber = request.query.page;
        const pageSize = request.query.size;
        let order = null;
        let orderBy = 'name';
        let direction = 1;

        if (request.query.sort) {
            order = request.query.sort.split(',');
            orderBy = order[0];
            direction = order[1].toLowerCase() === 'asc' ? 1 : -1;
        }

        const devsList = await model.find({}).sort([[orderBy, direction]]).lean().exec();

        let _pagination = pagination(pageNumber, pageSize, devsList)
        _pagination.content = convertId(_pagination.content);

        response.json(_pagination);
    },

    async store(request, response) {
        const newMateria = new model({
            name: request.body.name
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
            name: request.body.name
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
        })
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