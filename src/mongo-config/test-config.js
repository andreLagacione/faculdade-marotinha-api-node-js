const mongoose = require('mongoose');
let testSchema = new mongoose.Schema({}, {
    collection: 'test'
});

mongoose.connect(
    'mongodb://localhost:27017/faculdade_marotinha_test',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

const model = mongoose.model('test', testSchema, 'test', true);

const setSchema = schema => {
    testSchema = new mongoose.Schema(schema, {
        collection: 'test'
    });
}

const Test = mongoose.model('test', testSchema);

const initDb = async data => {
    const request = new model(data);
    return await request.save();
}


module.exports = {
    setSchema,
    initDb,
    getTest: () => Test.find(),
    addTest: data => new Test(data).save(),
    deleteTest: id => Test.findByIdAndRemove(id)
};