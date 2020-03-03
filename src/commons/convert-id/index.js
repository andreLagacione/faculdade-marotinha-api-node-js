const ObjectId = require('mongodb').ObjectID;

exports.convertId = (elements) => {
    elements.map((value) => {
        value.id = value._id;
        delete value._id;
    });

    return elements;
};

exports.structureArrayOfObjectId = (idsArray) => {
    let arrayObjectIds = [];

    idsArray.map(id => {
        arrayObjectIds.push(ObjectId(id));
    });

    return arrayObjectIds;
}