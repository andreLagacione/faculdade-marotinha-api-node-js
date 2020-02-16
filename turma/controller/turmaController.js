const db = require('../../mongo-config');
const schema = require('../schema');
const { pagination, paginationParams } = require('../../commons/pagination');
const model = db.model('turmas', schema, 'turmas', true);
const professorModel = db.model('professores');
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

    async store(request, response) {
        const canCreate = await turmaValidate(request.body);

        if (!canCreate) {
            response.status(406).send({
                httpStatus: 'Method Not Allowed',
                httpStatusCode: 405,
                message: 'Já existe uma turma cadastrada para este ano, com esta matéria, com o mesmo porfessor e no mesmo periódo. Por favor informe outros dados!'
            });

            return false;
        }

        const cursoName = await getRegisterById(cursoModel, request.body.curso, 'name');
        const professorName = await getRegisterById(professorModel, request.body.professor, 'name');

        const newCurso = new model({
            ano: request.body.ano,
            curso: request.body.curso,
            cursoName: cursoName,
            professor: request.body.professor,
            professorName: professorName,
            periodo: request.body.periodo
        });

        const save = await newCurso.save();

        response.json({
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Turma adicionado com sucesso!'
        });
    },
}

const turmaListDTO = professorList => {
    let listDTO = [];

    professorList.map(item => {
        listDTO.push({
            ano: item.ano,
            curso: item.cursoName,
            professor: item.professorName,
            totalAlunos: 10,
            periodo: item.periodo,
        });
    });

    return listDTO;
}

const getRegisterById = async (model, id, propNameToReturn) => {
    const item = await model.find({ '_id': new ObjectId(id) }).lean().exec();
    return item[0][propNameToReturn];
}

const turmaValidate = async (bodyRequest) => {
    const item = await model.find({
        'ano': bodyRequest.ano,
        'curso': bodyRequest.curso,
        'professor': bodyRequest.professor,
        'periodo': bodyRequest.periodo
    }).lean().exec();

    if (!item.length) {
        return true;
    }

    if (bodyRequest.id === item[0]._id) {
        return true;
    }

    return false;
}