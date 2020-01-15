const router = require('express').Router();
const db = require('../mongo-config');
const schema = require('./schema');


router.get('/', (request, response) => {
	const pageNumber = request.body.pageNumber;
    const pageSize = request.body.pageSize;
    const model = db.model('materias', schema, 'materias');

    model.find({}).lean().exec(
        (_error, _response) => {
            console.log('getList ' + _error, _response);
            response.json(_response);
        }
    );
});


module.exports = router;