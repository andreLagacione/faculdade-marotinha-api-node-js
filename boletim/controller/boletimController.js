const db = require('../../mongo-config');
const schema = require('../schema');
const { pagination, paginationParams } = require('../../commons/pagination');
const model = db.model('boletim', schema, 'boletim', true);
const materiaModel = db.model('materias');
const ObjectId = require('mongodb').ObjectID;
const { convertId, structureArrayOfObjectId } = require('../../commons/convert-id');
const { checkCpf, findRegisterByCpf } = require('../../commons/cpf');
const { validateIfHasSubjects } = require('../../commons/validators');

module.exports = {
    async index(request, response) {
        const _paginationParams = paginationParams(request);
        const boletimList = await model.find({}).sort([[_paginationParams.orderBy, _paginationParams.direction]]).lean().exec();
        let _pagination = pagination(_paginationParams.pageNumber, _paginationParams.pageSize, boletimList)
        _pagination.content = convertId(_pagination.content);
        response.json(_pagination);
    },

};