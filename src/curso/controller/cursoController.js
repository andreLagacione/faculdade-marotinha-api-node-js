const db = require('../../mongo-config');
const schema = require('../schema');
const { buildPagination } = require('../../commons/pagination');
const model = db.model('cursos', schema, 'cursos', true);
const materiaModel = db.model('materias');
const { convertId, structureArrayOfObjectId } = require('../../commons/convert-id');
const { validateIfCourseExist, validateIfHasSubjects } = require('../../commons/validators');
const { removeData } = require('../../commons/removeData');

module.exports = {
    async index(request, response) {
        let _pagination = await buildPagination(request, model);
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
            name: request.body.name.trim(),
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
    },

    async update(request, response) {
        let cursoId = request.body.id;
        const validateCourse = await validateIfCourseExist(request.body.name, model, cursoId);
        const validateSubjects = validateIfHasSubjects(request.body.materias);

        if (validateCourse) {
            response.status(validateCourse.httpStatusCode).send(validateCourse);
            return false;
        }

        if (validateSubjects) {
            response.status(validateSubjects.httpStatusCode).send(validateSubjects);
            return false;
        }

        const _response = await model.updateOne({
            _id: cursoId
        }, {
                $set: {
                    name: request.body.name.trim(),
                    materias: request.body.materias
            }
        });

        if (_response && _response.n === 0) {
            response.status(404).send({
                httpStatus: 'Not Found',
                httpStatusCode: 404,
                message: 'Curso não encontrado!'
            });

            return false;
        }

        response.json({
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Curso alterado com sucesso!'
        });
    },

    async destroy(request, response) {
        return removeData(response, model, request.params.id, 'Curso não encontrado(a)!', 'Curso removido com sucesso!');
    }
}

const cursoListDTO = (cursoList) => {
    let listDTO = [];

    cursoList.map(item => {
        listDTO.push({
            nome: item.name,
            id: item._id
        });
    });

    return listDTO;
}