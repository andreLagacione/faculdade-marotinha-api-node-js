exports.buildComboList = async (response, model, propToMap) => {
    const data = await model.find({}).sort([[propToMap, 'asc']]).lean().exec();
    let comboList = [];

    data.map(item => {
        comboList.push({
            [propToMap]: item.name,
            id: item._id
        });
    });

    return response.json(comboList);
}