exports.validateIfCourseExist = async (courseName, model) => {
    const courses = await model.find({}).lean().exec();

    for (let item of courses) {
        if (item.name === courseName) {
            return {
                httpStatus: 'Method Not Allowed',
                httpStatusCode: 405,
                message: 'Já existe um curso cadastrado com esse nome. Por favor informe outro nome!'
            };
        }
    }

    return false;
}

exports.validateIfHasSubjects = (subjectsList) => {
    if (!subjectsList.length) {
        return {
            httpStatus: 'Method Not Allowed',
            httpStatusCode: 405,
            message: 'Informe pelo menos uma matéria!'
        };
    }

    return false;
}