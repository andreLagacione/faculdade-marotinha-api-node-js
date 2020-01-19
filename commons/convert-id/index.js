exports.convertId = (elements) => {
    elements.map((value) => {
        value.id = value._id;
        delete value._id;
    });

    return elements;
};