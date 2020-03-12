const expect = require('chai').expect;
const db = require('../../mongo-config/test-config');
const schema = require('../schema');
const model = db.model('turmas', schema, 'turmas', true);

describe('Teste Aluno Controller', () => {
    beforeEach(async () => {
        await insertAluno();
    });

    afterEach(() => {
        model.collection.drop();
    });

    it('Should find all Alunos', async () => {
        const item = await findAluno();

        expect(item.length).to.equal(1);
        expect(item[0].name).to.equal('André');
        expect(item[0].age).to.equal(30);
        expect(item[0].cpf).to.equal('123456789');
        expect(item[0].phone).to.equal('123456789');
        expect(item[0].turmas.length).to.equal(0);
    });

    it('Should add new Aluno', async () => {
        const newAluno = await insertAluno();
        const item = await findAluno();

        expect(newAluno.name).to.equal('André');
        expect(newAluno.age).to.equal(30);
        expect(newAluno.cpf).to.equal('123456789');
        expect(newAluno.phone).to.equal('123456789');
        expect(newAluno.turmas.length).to.equal(0);

        expect(item.length).to.equal(2);
        expect(item[1].name).to.equal('André');
        expect(item[1].age).to.equal(30);
        expect(item[1].cpf).to.equal('123456789');
        expect(item[1].phone).to.equal('123456789');
        expect(item[1].turmas.length).to.equal(0);
    });
});

const insertAluno = async () => {
    return await model.create({
        name: 'André',
        age: 30,
        cpf: '123456789',
        phone: '123456789',
        turmas: []
    });
};

const findAluno = async () => {
    return await model.find();
};