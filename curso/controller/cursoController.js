const db = require('../../mongo-config');
const schema = require('../schema');
const { pagination, paginationParams } = require('../../commons/pagination');
const model = db.model('cursos', schema, 'cursos', true);
const materiaModel = db.model('materias');
const ObjectId = require('mongodb').ObjectID;
const { convertId, structureArrayOfObjectId } = require('../../commons/convert-id');
const { validateIfCourseExist, validateIfHasSubjects } = require('../../commons/validators');

module.exports = {
    async index(request, response) {
        const _paginationParams = paginationParams(request);
        const cursoList = await model.find({}).sort([[_paginationParams.orderBy, _paginationParams.direction]]).lean().exec();
        let _pagination = pagination(_paginationParams.pageNumber, _paginationParams.pageSize, cursoList)
        _pagination.content = cursoListDTO(_pagination.content);
        response.json(_pagination);
    },

    async store(request, response) {
        const validateCourse = await validateIfCourseExist(request.body.name, model);
        const validateSubjects = validateIfHasSubjects(request.body.materias);

        if (validateCourse) {
            response.status(validateCourse.httpStatusCode).send(validateCourse);
            return false;
        }

        if (validateSubjects) {
            response.status(validateSubjects.httpStatusCode).send(validateSubjects);
            return false;
        }

        const newCurso = new model({
            nome: request.body.name.trim(),
            materias: request.body.materias
        });

        const save = await newCurso.save();

        response.json({
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Curso adicionado com sucesso!'
        });
    },

    async show(request, response) {
        const _id = request.params.id;
        const curso = await model.findById(_id).lean().exec();
        let materiasList;

        if (curso) {
            const idMaterias = curso.materias;

            if (idMaterias.length) {
                const objectIdArray = structureArrayOfObjectId(idMaterias);
                materiasList = await materiaModel.find({
                    _id: {
                        $in: objectIdArray
                    }
                }).lean().exec();
            }

            curso.materias = convertId(materiasList);
            response.setHeader('Content-Type', 'application/json');
            response.json(convertId([curso])[0]);
            return false;
        }

        response.status(404).send({
            httpStatus: 'Not Found',
            httpStatusCode: 404,
            message: 'Curso não encontrado!'
        });
    }
}

const cursoListDTO = (cursoList) => {
    let listDTO = [];

    cursoList.map(item => {
        listDTO.push({
            nome: item.nome,
            id: item._id
        });
    });

    return listDTO;
}