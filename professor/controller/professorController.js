const db = require('../../mongo-config');
const schema = require('../schema');
const { pagination } = require('../../commons/pagination');
const model = db.model('professores', schema, 'professores', true);
const materiaModel = db.model('materias');
const ObjectId = require('mongodb').ObjectID;
const { convertId, structureArrayOfObjectId } = require('../../commons/convert-id');
const { checkCpf, findRegisterByCpf } = require('../../commons/cpf');

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
        const _checkCpf = await checkCpf(cpf, model, true);

        if (_checkCpf) {
            response.status(_checkCpf.httpStatusCode).send(_checkCpf);
            return false;
        }

        const newProfessor = new model({
            name: request.body.name,
            age: request.body.age,
            cpf: cpf,
            phone: request.body.phone,
            materias: request.body.materias
        });

        const save = await newProfessor.save();

        response.json({
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Professor adicionado com sucesso!'
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
        const cpf = request.body.cpf;
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
                    name: request.body.name,
                    age: request.body.age,
                    cpf: cpf,
                    phone: request.body.phone,
                    materias: request.body.materias
            }
        });

        if (_response && _response.nModified === 0) {
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
};