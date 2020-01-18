const router = require('express').Router();
const db = require('../mongo-config');
const schema = require('./schema');
const { pagination } = require('../commons/pagination');


router.get('/', (request, response) => {
	const pageNumber = request.body.pageNumber;
    const pageSize = request.body.pageSize;
    const model = db.model('materias', schema, 'materias');

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


module.exports = router;