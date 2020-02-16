const db = require('../../mongo-config');
const schema = require('../schema');
const { pagination, paginationParams } = require('../../commons/pagination');
const model = db.model('alunos', schema, 'alunos', true);
const turmaModel = db.model('turmas');
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