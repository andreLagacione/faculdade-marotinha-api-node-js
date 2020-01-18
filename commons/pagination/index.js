exports.pagination = (pageNumber = 0, pageSize = 25, elements) => {
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
        size: pageSize,
        number: pageNumber,
        numberOfElements: pageSize || 25
    }
}