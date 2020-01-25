const db = require('../../mongo-config');
const schema = require('../schema');
const model = db.model('materias', schema, 'materias');
const { convertId } = require('../../commons/convert-id');

module.exports = {
    async index(request, response) {
        const materias = await model.find({}).sort([['name', 'asc']]).lean().exec();
        response.json(convertId(materias));
    }
}