const db = require('../../mongo-config');
const schema = require('../schema');
const model = db.model('alunos', schema, 'alunos');

module.exports = {
    async index(request, response) {
        const professores = await model.find({}).sort([['name', 'asc']]).lean().exec();
        let comboList = [];

        professores.map(item => {
            comboList.push({
                name: item.name,
                id: item._id
            });
        });

        response.json(comboList);
    }
}