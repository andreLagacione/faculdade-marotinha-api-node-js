const router = require('express').Router();
const db = require('../mongo-config');
const schema = require('./schema');
const { pagination } = require('../commons/pagination');
const model = db.model('materias', schema, 'materias');
const ObjectId = require('mongodb').ObjectID;
const { convertId } = require('../commons/convert-id');

router.get('/', (request, response) => {
	const pageNumber = request.body.pageNumber;
    const pageSize = request.body.pageSize;

    model.find({}).lean().exec(
        (_error, _response) => {
            if (_error) {
                response.json(_error);
            }

            let _pagination = pagination(pageNumber, pageSize, _response)
            _pagination.content = convertId(_pagination.content);

            response.json(_pagination);
        }
    );
});

router.post('/', (request, response) => {
    const newMateria = new model({
        name: request.body.name
    });

    newMateria.save(_error => {
        if (_error) {
            response.json(_error);
        }

        response.json({
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Matéria adicionada com sucesso!'
        });
    });
});

router.get('/:id', (request, response) => {
    const _id = request.params.id;
    
    model.findOne({
        "_id": new ObjectId(_id)
    }, (_error, _response) => {
            if (_error) {
                response.json(_error);
            }

            _response = convertId([_response]);
            response.json(_response);
    })
});

router.put('/', (request, response) => {
    const _id = request.body.id;
    const oldElement = { _id: _id };
    const newValue = {
        name: request.body.name
    };

    model.updateOne(oldElement, newValue, (_error, _response) => {
        if (_error) {
            response.json({error: _error});
        }

        response.json({
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Matéria alterada com sucesso!'
        })
    });
});


module.exports = router;