const router = require('express').Router();
const db = require('../mongo-config');
const schema = require('./schema');
const { pagination } = require('../commons/pagination');
const model = db.model('materias', schema, 'materias');

router.get('/', (request, response) => {
	const pageNumber = request.body.pageNumber;
    const pageSize = request.body.pageSize;

    model.find({}).lean().exec(
        (_error, _response) => {
            if (_error) {
                return _error;
            }

            let _pagination = pagination(pageNumber, pageSize, _response)
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
            return _error;
        }

        response.json({
            httpStatus: 'OK',
            httpStatusCode: 200,
            message: 'Matéria adicionada com sucesso!'
        });
    });
});


module.exports = router;