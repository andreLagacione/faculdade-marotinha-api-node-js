const db = require('../../mongo-config');
const schema = require('../schema');
const model = db.model('turmas', schema, 'turmas');

module.exports = {
    async index(request, response) {
        const turmas = await model.find({}).sort([['name', 'asc']]).lean().exec();
        let comboList = [];

        turmas.map(item => {
            comboList.push({
                name: `${item.cursoName} - período da ${item.periodo}`,
                id: item._id
            });
        });

        response.json(comboList);
    }
}