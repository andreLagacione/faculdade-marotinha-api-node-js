const expect = require('chai').expect;
const { setSchema, initDb, getTest, addTest, deleteTest } = require('../../mongo-config/test-config');

describe('Teste Aluno ComboList', () => {
    const schema = {
        name: String,
        age: Number,
        cpf: String,
        phone: String,
        turmas: Array
    };

    beforeEach(() => {
        setSchema(schema);
        initDb({
            name: 'André',
            age: 30,
            cpf: '123456789',
            phone: '123456789',
            turmas: []
        });
    });

    it('Should find all ALunos', () => {
        return getTest()
            .then(item => {
                expect(item.length).to.equal(1);
            });
    });
});