const db = require('../../mongo-config');
const schema = require('../schema');
const { pagination, paginationParams } = require('../../commons/pagination');
const model = db.model('alunos', schema, 'alunos', true);
const materiaModel = db.model('materias');
const ObjectId = require('mongodb').ObjectID;
const { convertId, structureArrayOfObjectId } = require('../../commons/convert-id');
const { checkCpf, findRegisterByCpf } = require('../../commons/cpf');
const { validateIfHasSubjects } = require('../../commons/validators');

module.exports = {
    async index(request, response) {
        const _paginationParams = paginationParams(request);
        const alunoList = await model.find({}).sort([[_paginationParams.orderBy, _paginationParams.direction]]).lean().exec();
        let _pagination = pagination(_paginationParams.pageNumber, _paginationParams.pageSize, alunoList)
        _pagination.content = alunoListDTO(_pagination.content);
        response.json(_pagination);
    },
};

const alunoListDTO = (professorList) => {
    let listDTO = [];

    professorList.map(item => {
        listDTO.push({
            name: item.name,
            age: item.age,
            cpf: item.cpf,
            phone: item.phone,
            id: item._id
        });
    });

    return listDTO;
}