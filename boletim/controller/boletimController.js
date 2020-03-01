const db = require('../../mongo-config');
const schema = require('../schema');
const { pagination, paginationParams } = require('../../commons/pagination');
const model = db.model('boletim', schema, 'boletim', true);
const ObjectId = require('mongodb').ObjectID;
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
        const { ano, idProfessor, idAluno, idTurma } = request.body;
        const canSave = await findBoletim(request);

        if (!canSave.length) {
            const newBoletim = new model({
                ano: ano,
                professor: idProfessor,
                aluno: idAluno,
                turma: idTurma
            });

            await newBoletim.save();

            response.json({
                httpStatus: 'OK',
                httpStatusCode: 200,
                message: 'Boletim adicionado com sucesso!'
            });

            return false;
        }

        response.status(405).send({
            httpStatus: 'Method Not Allowed',
            httpStatusCode: 405,
            message: 'Já existe um boletim cadastrado com essas informações!'
        });
    },

    async show(request, response) {
        const _id = request.params.id;
        const boletim = await model.findById(_id).lean().exec();

        if (boletim) {
            response.setHeader('Content-Type', 'application/json');
            response.json({
                id: boletim._id,
                ano: boletim.ano,
                idProfessor: boletim.professor,
                idAluno: boletim.aluno,
                idTurma: boletim.turma,
            });
            return false;
        }

        response.status(404).send({
            httpStatus: 'Not Found',
            httpStatusCode: 404,
            message: 'Boletim não encontrado!'
        });
    },

    async update(request, response) {
        const { ano, idProfessor, idAluno, idTurma, id } = request.body;
        const canSave = await findBoletim(request);

        if (canSave.length) {
            if (id != canSave[0]._id) {
                response.status(405).send({
                    httpStatus: 'Method Not Allowed',
                    httpStatusCode: 405,
                    message: 'Já existe um registro cadastrado com esses Dados!'
                });

                return false;
            }
        }

        const _response = await model.updateOne({
            _id: id
        }, {
            $set: {
                ano: ano,
                professor: idProfessor,
                aluno: idAluno,
                turma: idTurma
            }
        });

        if (_response && _response.n === 0) {
            response.status(404).send({
                httpStatus: 'Not Found',
                httpStatusCode: 404,
                message: 'Boletim não encontrado!'
            });

            return false;
        }

        response.json({
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Boletim alterado com sucesso!'
        });
    },

    async destroy(request, response) {
        const _id = request.params.id;

        const _response = await model.deleteOne({
            '_id': new ObjectId(_id)
        });

        if (_response && _response.deletedCount === 0) {
            response.status(404).send({
                httpStatus: 'Not Found',
                httpStatusCode: 404,
                message: 'Boletim não encontrado!'
            });

            return false;
        }

        response.json({
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Boletim removido com sucesso!'
        });
    }

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
                id: item._id,
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

const findBoletim = async (request) => {
    const { ano, idProfessor, idAluno, idTurma } = request.body;

    return await model.find({
        ano: ano,
        professor: ObjectId(idProfessor),
        aluno: ObjectId(idAluno),
        turma: ObjectId(idTurma)
    }).lean().exec();
}

