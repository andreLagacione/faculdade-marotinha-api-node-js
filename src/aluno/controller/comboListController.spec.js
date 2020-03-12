const expect = require('chai').expect;
const db = require('../../mongo-config/test-config');
const schema = require('../schema');
const model = db.model('turmas', schema, 'turmas', true);

describe('Teste Aluno ComboList', () => {
    beforeEach(() => {
        model.create({
            name: 'André',
            age: 30,
            cpf: '123456789',
            phone: '123456789',
            turmas: []
        });
    });

    afterEach(() => {
        model.collection.drop();
    });

    it('Should find all Alunos', async () => {
        const item = await model.find();

        expect(item.length).to.equal(1);
        expect(item[0].name).to.equal('André');
        expect(item[0].age).to.equal(30);
        expect(item[0].cpf).to.equal('123456789');
        expect(item[0].phone).to.equal('123456789');
        expect(item[0].turmas.length).to.equal(0);
    });
});