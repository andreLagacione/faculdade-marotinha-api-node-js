const db = require('../../mongo-config');
const schema = require('../schema');
const { pagination, paginationParams } = require('../../commons/pagination');
const model = db.model('boletim', schema, 'boletim', true);
const materiaModel = db.model('materias');
const ObjectId = require('mongodb').ObjectID;
const { convertId, structureArrayOfObjectId } = require('../../commons/convert-id');
const { checkCpf, findRegisterByCpf } = require('../../commons/cpf');
const { validateIfHasSubjects } = require('../../commons/validators');

const { getById } = require('../../commons/getData');

module.exports = {
    async index(request, response) {
        const _paginationParams = paginationParams(request);
        const boletimList = await model.find({}).sort([[_paginationParams.orderBy, _paginationParams.direction]]).lean().exec();
        let _pagination = pagination(_paginationParams.pageNumber, _paginationParams.pageSize, boletimList)
        _pagination.content = await boletimListDTO(_pagination.content);
        response.json(_pagination);
    },

    async store(request, response) {
        const body = request.body;

        const newBoletim = new model({
            ano: body.ano,
            professor: body.idProfessor,
            aluno: body.idAluno,
            turma: body.idTurma,
            notas: []
        });

        const save = await newBoletim.save();

        response.json({
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Boletim adicionado com sucesso!'
        });
    },

};

const boletimListDTO = async (professorList) => {
    let boletimDTO = [];

    await Promise.all(
        professorList.map(async item => {
            const aluno = await getById(`/aluno/${item.aluno}`);
            const professor = await getById(`/professor/${item.professor}`);
            const turma = await getById(`/turma/${item.turma}`);
            const curso = await getById(`/curso/${turma.curso.id}`);

            boletimDTO.push({
                ano: item.ano,
                nomeAluno: aluno.name,
                nomeProfessor: professor.name,
                nomeTurma: `${curso.name} - período da ${turma.periodo}`,
                canPrint: item.notas.length ? true : false
            });
        })
    );

    return boletimDTO;
};

