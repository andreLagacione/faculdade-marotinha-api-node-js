const db = require('../../mongo-config');
const schema = require('../schema');
const { pagination, paginationParams } = require('../../commons/pagination');
const model = db.model('turmas', schema, 'turmas', true);
const materiaModel = db.model('materias');
const cursoModel = db.model('cursos');
const ObjectId = require('mongodb').ObjectID;
const { convertId, structureArrayOfObjectId } = require('../../commons/convert-id');
const { checkCpf, findRegisterByCpf } = require('../../commons/cpf');
const { validateIfHasSubjects } = require('../../commons/validators');

module.exports = {
    async index(request, response) {
        const _paginationParams = paginationParams(request);
        const professorList = await model.find({}).sort([[_paginationParams.orderBy, _paginationParams.direction]]).lean().exec();
        let _pagination = pagination(_paginationParams.pageNumber, _paginationParams.pageSize, professorList)
        _pagination.content = await turmaListDTO(_pagination.content);
        response.json(_pagination);
    },
}

const turmaListDTO = async (professorList) => {
    let listDTO = [];

    professorList.map(item => {
        listDTO.push({
            ano: item.ano,
            curso: await getRegisterById(cursoModel, 'curso', item.curso, 'nome'),
            professor: item.professor,
            totalAlunos: 10,
            periodo: item.periodo,
        });
    });

    return listDTO;
}

const getRegisterById = async (model, propInModel, id, propNameToReturn) => {
    const item = await model.find({ [propInModel]: id }).lean().exec();
    return item[0][propNameToReturn];
}