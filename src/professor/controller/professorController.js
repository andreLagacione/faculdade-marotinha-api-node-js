const db = require('../../mongo-config');
const schema = require('../schema');
const { buildPagination } = require('../../commons/pagination');
const model = db.model('professores', schema, 'professores', true);
const materiaModel = db.model('materias');
const { convertId, structureArrayOfObjectId } = require('../../commons/convert-id');
const { checkCpf, findRegisterByCpf } = require('../../commons/cpf');
const { validateIfHasSubjects } = require('../../commons/validators');
const { removeData } = require('../../commons/removeData');

module.exports = {
    async index(request, response) {
        let _pagination = await buildPagination(request, model);
        _pagination.content = professorListDTO(_pagination.content);
        response.json(_pagination);
    },

    async store(request, response) {
        const cpf = request.body.cpf.trim();
        const _checkCpf = await checkCpf(cpf, model, true);
        const validateSubjects = validateIfHasSubjects(request.body.materias);

        if (_checkCpf) {
            response.status(_checkCpf.httpStatusCode).send(_checkCpf);
            return false;
        }

        if (validateSubjects) {
            response.status(validateSubjects.httpStatusCode).send(validateSubjects);
            return false;
        }

        const newProfessor = new model({
            name: request.body.name.trim(),
            age: request.body.age,
            cpf: cpf,
            phone: request.body.phone.trim(),
            materias: request.body.materias
        });

        const save = await newProfessor.save();

        response.json({
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Professor(a) adicionado(a) com sucesso!'
        });
    },

    async show(request, response) {
        const _id = request.params.id;
        const professor = await model.findById(_id).lean().exec();
        let materiasList;

        if (professor) {
            const idMaterias = professor.materias;

            if (idMaterias.length) {
                const objectIdArray = structureArrayOfObjectId(idMaterias);
                materiasList = await materiaModel.find({
                    _id: {
                        $in: objectIdArray
                    }
                }).lean().exec();
            }

            professor.materias = convertId(materiasList);
            response.setHeader('Content-Type', 'application/json');
            response.json(convertId([professor])[0]);
            return false;
        }

        response.status(404).send({
            httpStatus: 'Not Found',
            httpStatusCode: 404,
            message: 'Professor(a) não encontrado(a)!'
        });
    },

    async update(request, response) {
        const cpf = request.body.cpf.trim();
        let professorId = request.body.id;
        const findProfessor = await findRegisterByCpf(cpf, model);
        let idProfessorFound;

        if (findProfessor.length) {
            idProfessorFound = findProfessor[0]._id.toString();
        }

        if (idProfessorFound !== professorId) {
            response.status(405).send({
                httpStatus: 'Method Not Allowed',
                httpStatusCode: 405,
                message: 'Já existe um registro cadastrado com esse CPF. Por favor informe outro CPF!'
            });
        }

        const _checkCpf = await checkCpf(cpf, model, false);

        if (_checkCpf) {
            response.status(_checkCpf.httpStatusCode).send(_checkCpf);
            return false;
        }

        const _response = await model.updateOne({
            _id: professorId
        }, {
            $set: {
                name: request.body.name.trim(),
                age: request.body.age,
                cpf: cpf,
                phone: request.body.phone.trim(),
                materias: request.body.materias
            }
        });

        if (_response && _response.n === 0) {
            response.status(404).send({
                httpStatus: 'Not Found',
                httpStatusCode: 404,
                message: 'Professor(a) não encontrado(a)!'
            });

            return false;
        }

        response.json({
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Professor(a) alterado(a) com sucesso!'
        });
    },

    async destroy(request, response) {
        return removeData(response, model, request.params.id, 'Professor(a) não encontrado(a)!', 'Professor(a) removido(a) com sucesso!');
    }
};

const professorListDTO = (professorList) => {
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