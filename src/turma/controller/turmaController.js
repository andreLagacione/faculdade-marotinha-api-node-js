const db = require('../../mongo-config');
const schema = require('../schema');
const { buildPagination } = require('../../commons/pagination');
const model = db.model('turmas', schema, 'turmas', true);
const professorModel = db.model('professores');
const cursoModel = db.model('cursos');
const ObjectId = require('mongodb').ObjectID;
const { removeData } = require('../../commons/removeData');

module.exports = {
    async index(request, response) {
        const filter = buildFilter(request.body);
        let _pagination = await buildPagination(request, model, filter);
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
            ano: request.body.ano.trim(),
            curso: request.body.curso.trim(),
            cursoName: cursoName.trim(),
            professor: request.body.professor.trim(),
            professorName: professorName.trim(),
            periodo: request.body.periodo.trim()
        });

        const save = await newCurso.save();

        response.json({
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Turma adicionado com sucesso!'
        });
    },

    async show(request, response) {
        const _id = request.params.id;
        const turma = await model.findById(_id).lean().exec();

        if (turma) {
            const buildTurma = {
                id: turma._id,
                ano: turma.ano,
                curso: {
                    id: turma.curso
                },
                professor: {
                    id: turma.professor
                },
                periodo: turma.periodo,
            }

            response.setHeader('Content-Type', 'application/json');
            response.json(buildTurma);
            return false;
        }

        response.status(404).send({
            httpStatus: 'Not Found',
            httpStatusCode: 404,
            message: 'Turma não encontrada!'
        });
    },

    async update(request, response) {
        const turmaId = request.body.id;
        const canCreate = await turmaValidate(request.body);

        if (!canCreate) {
            response.status(405).send({
                httpStatus: 'Method Not Allowed',
                httpStatusCode: 405,
                message: 'Já existe uma turma cadastrada para este ano, com esta matéria, com o mesmo porfessor e no mesmo periódo. Por favor informe outros dados!'
            });

            return false;
        }

        const cursoName = await getRegisterById(cursoModel, request.body.curso, 'name');
        const professorName = await getRegisterById(professorModel, request.body.professor, 'name');

        const _response = await model.updateOne({
            _id: turmaId
        }, {
            $set: {
                ano: request.body.ano.trim(),
                curso: request.body.curso.trim(),
                cursoName: cursoName.trim(),
                professor: request.body.professor.trim(),
                professorName: professorName.trim(),
                periodo: request.body.periodo.trim()
            }
        });

        if (_response && _response.n === 0) {
            response.status(404).send({
                httpStatus: 'Not Found',
                httpStatusCode: 404,
                message: 'Turma não encontrada!'
            });

            return false;
        }

        response.json({
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Turma alterada com sucesso!'
        });
    },

    async destroy(request, response) {
        return removeData(response, model, request.params.id, 'Turma não encontrada!', 'Turma removida com sucesso!');
    }
}

const turmaListDTO = professorList => {
    let listDTO = [];

    professorList.map(item => {
        listDTO.push({
            id: item._id,
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

    if (bodyRequest.id == item[0]._id) {
        return true;
    }

    return false;
}

const buildFilter = body => {
    const filter = {};

    if (body) {
        if (body.ano) {
            filter.ano = body.ano;
        }

        if (body.idCurso) {
            filter.curso = body.idCurso;
        }

        if (body.idProfessor) {
            filter.professor = body.idProfessor;
        }

        if (body.periodo) {
            filter.periodo = body.periodo;
        }
    }

    return filter;
}