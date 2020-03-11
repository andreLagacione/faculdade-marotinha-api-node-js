const mongoose = require('mongoose');
let testSchema;
let model;
let Test;

mongoose.connect(
    'mongodb://localhost:27017/faculdade_marotinha_test',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

const setSchema = schema => {
    testSchema = new mongoose.Schema(schema, {
        collection: 'test'
    });

    model = mongoose.model('test', testSchema, 'test', true);
    Test = mongoose.model('test', testSchema);
}

const initDb = async data => {
    const request = new model(data);
    return await request.save();
}

const dropBd = () => {
    model.collection.drop();
}


module.exports = {
    setSchema,
    initDb,
    dropBd,
    getTest: () => Test.find(),
    addTest: data => new Test(data).save(),
    deleteTest: id => Test.findByIdAndRemove(id)
};