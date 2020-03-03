
const ObjectId = require('mongodb').ObjectID;

exports.removeData = async (response, model, id, successMessage, errorMessage) => {
    const _response = await model.deleteOne({
        '_id': new ObjectId(id)
    });

    if (_response && _response.deletedCount === 0) {
        return response.status(404).send({
            httpStatus: 'Not Found',
            httpStatusCode: 404,
            message: errorMessage
        });
    }

    return response.json({
        httpStatus: 'OK',
        httpStatusCode: 200,
        message: successMessage
    });

}