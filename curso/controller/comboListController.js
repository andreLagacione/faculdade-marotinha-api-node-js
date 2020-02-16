const db = require('../../mongo-config');
const schema = require('../schema');
const model = db.model('cursos', schema, 'cursos');

module.exports = {
    async index(request, response) {
        const cursos = await model.find({}).sort([['nome', 'asc']]).lean().exec();
        let comboList = [];

        cursos.map(item => {
            comboList.push({
                nome: item.name,
                id: item._id
            });
        });

        response.json(comboList);
    }
}