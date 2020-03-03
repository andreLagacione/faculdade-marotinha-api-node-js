const db = require('../../mongo-config');
const schema = require('../schema');
const { buildPagination } = require('../../commons/pagination');
const model = db.model('alunos', schema, 'alunos', true);
const turmaModel = db.model('turmas');
const { convertId, structureArrayOfObjectId } = require('../../commons/convert-id');
const { checkCpf, findRegisterByCpf } = require('../../commons/cpf');
const { validateIfHasSubjects } = require('../../commons/validators');
const { removeData } = require('../../commons/removeData');

module.exports = {
    async index(request, response) {
        let _pagination = await buildPagination(request, model);
        _pagination.content = alunoListDTO(_pagination.content);
        response.json(_pagination);
    },

    async store(request, response) {
        const cpf = request.body.cpf.trim();
        const _checkCpf = await checkCpf(cpf, model, true);
        const validateSubjects = validateIfHasSubjects(request.body.turmas, 'turma');

        if (_checkCpf) {
            response.status(_checkCpf.httpStatusCode).send(_checkCpf);
            return false;
        }

        if (validateSubjects) {
            response.status(validateSubjects.httpStatusCode).send(validateSubjects);
            return false;
        }

        const newAluno = new model({
            name: request.body.name.trim(),
            age: request.body.age,
            cpf: cpf,
            phone: request.body.phone.trim(),
            turmas: request.body.turmas
        });

        const save = await newAluno.save();

        response.json({
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Aluno(a) adicionado(a) com sucesso!'
        });
    },

    async show(request, response) {
        const _id = request.params.id;
        const aluno = await model.findById(_id).lean().exec();
        let turmasList;

        if (aluno) {
            const idTurmas = aluno.turmas;

            if (idTurmas.length) {
                const objectIdArray = structureArrayOfObjectId(idTurmas);
                turmasList = await turmaModel.find({
                    _id: {
                        $in: objectIdArray
                    }
                }).lean().exec();
            }

            aluno.turmas = buildTurmaDTO(turmasList);
            response.setHeader('Content-Type', 'application/json');
            response.json(convertId([aluno])[0]);
            return false;
        }

        response.status(404).send({
            httpStatus: 'Not Found',
            httpStatusCode: 404,
            message: 'Aluno(a) não encontrado(a)!'
        });
    },

    async update(request, response) {
        const cpf = request.body.cpf.trim();
        let alunoId = request.body.id;
        const findAluno = await findRegisterByCpf(cpf, model);
        let idAlunoFound;

        if (findAluno.length) {
            idAlunoFound = findAluno[0]._id.toString();
        }

        if (idAlunoFound !== alunoId) {
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
            _id: alunoId
        }, {
            $set: {
                name: request.body.name.trim(),
                age: request.body.age,
                cpf: cpf,
                phone: request.body.phone.trim(),
                turmas: request.body.turmas
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
        return removeData(response, model, request.params.id, 'Aluno(a) não encontrado(a)!', 'Aluno(a) removido(a) com sucesso!');
    }
};

const alunoListDTO = (alunoList) => {
    let listDTO = [];

    alunoList.map(item => {
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

const buildTurmaDTO = (alunoList) => {
    let listDTO = [];

    alunoList.map(item => {
        listDTO.push({
            id: item._id,
            name: `${item.cursoName} - período da ${item.periodo}` 
        });
    });

    return listDTO;
}