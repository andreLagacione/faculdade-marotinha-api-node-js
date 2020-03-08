let chai = require('chai');
let sinon = require('sinon');
let sinonChai = require('sinon-chai');
chai.use(sinonChai);

global['fetch'] = require('node-fetch');

describe('Aluno Teste', () => {
    it('Should return true', (done) => {
        setImmediate(done);
    })
});