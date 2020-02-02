const db = require('../../mongo-config');
const schema = require('../schema');
const { pagination } = require('../../commons/pagination');
const model = db.model('professores', schema, 'professores', true);
const ObjectId = require('mongodb').ObjectID;
const { convertId } = require('../../commons/convert-id');
const { cpfValidator, findCpf } = require('../../commons/cpf');

module.exports = {
    async index(request, response) {
        const pageNumber = request.query.page;
        const pageSize = request.query.size;
        let order = null;
        let orderBy = 'name';
        let direction = 1;

        if (request.query.sort) {
            order = request.query.sort.split(',');
            orderBy = order[0];
            direction = order[1].toLowerCase() === 'asc' ? 1 : -1;
        }

        const professorList = await model.find({}).sort([[orderBy, direction]]).lean().exec();

        let _pagination = pagination(pageNumber, pageSize, professorList)
        _pagination.content = convertId(_pagination.content);

        response.json(_pagination);
    },

    async store(request, response) {
        const cpf = request.body.cpf;
        const cpfValidation = await cpfValidator(cpf);

        if (!cpfValidation) {
            response.status(405).send({
                httpStatus: 'Method Not Allowed',
                httpStatusCode: 405,
                message: 'O CPF informado não é válido!'
            });

            return false;
        }

        const verifyCpf = await findCpf(cpf, model);

        if (verifyCpf) {
            response.status(405).send({
                httpStatus: 'Method Not Allowed',
                httpStatusCode: 405,
                message: 'Já existe um professor cadastrado com esse CPF. Por favor informe outro CPF!'
            });

            return false;
        }

        const newProfessor = new model({
            name: request.body.name,
            age: request.body.age,
            cpf: cpf,
            phone: request.body.phone,
            materiasLecionadas: request.body.materias
        });

        const save = await newProfessor.save();

        response.json({
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Professor adicionado com sucesso!'
        });
    },
}