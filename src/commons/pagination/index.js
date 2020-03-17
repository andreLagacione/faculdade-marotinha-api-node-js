exports.buildPagination = async (request, model, filter = {}) => {
    const _paginationParams = paginationParams(request);
    const dataList = await model.find(filter).sort([[_paginationParams.orderBy, _paginationParams.direction]]).lean().exec();
    return pagination(_paginationParams.pageNumber, _paginationParams.pageSize, dataList)
}


const pagination = (pageNumber = 0, pageSize = 25, elements) => {
    const totalElements = elements.length;
    const totalPages = Math.ceil(totalElements / pageSize);
    const isFirstPage = pageNumber === 0 ? true : false;
    const isLastPage = pageNumber < totalPages ? false : true;
    let initGetData = 0;
    let endGetData = pageSize;

    if (pageNumber > 0 && !isLastPage) {
        initGetData = pageNumber * pageSize + 1;
    }

    if (isLastPage) {
        initGetData = pageNumber * pageSize - pageSize;
        endGetData = elements.length;
    }

    const elementsInPage = elements.splice(initGetData, endGetData);

    return {
        content: elementsInPage,
        totalElements: totalElements,
        totalPages: totalPages || 1,
        last: isLastPage,
        first: isFirstPage,
        size: parseInt(pageSize),
        number: parseInt(pageNumber),
        numberOfElements: pageSize || 25
    }
}

const paginationParams = (request, orderBy = 'name', direction = 1) => {
    const pageNumber = request.query.page;
    const pageSize = request.query.size;
    let order = null;

    if (request.query.sort) {
        order = request.query.sort.split(',');
        orderBy = order[0];
        direction = order[1].toLowerCase() === 'asc' ? 1 : -1;
    }

    return {
        pageNumber,
        pageSize,
        orderBy,
        direction
    };

}