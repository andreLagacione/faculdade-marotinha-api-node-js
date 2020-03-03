const db = require('../../mongo-config');
const schema = require('../schema');
const model = db.model('materias', schema, 'materias');
const { buildComboList } = require('../../commons/build-combo-list');

module.exports = {
    async index(request, response) {
        return await buildComboList(response, model, 'name');
    }
}