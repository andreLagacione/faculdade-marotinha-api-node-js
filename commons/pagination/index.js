exports.pagination = (pageNumber = 0, pageSize = 25, elements) => {
    console.log(pageNumber, pageSize);
    const totalElements = elements.length;
    const totalPages = Math.ceil(totalElements / pageSize);
    const isFirstPage = pageNumber === 0 ? true : false;
    const isLastPage = pageNumber < totalPages ? false : true;
    const initGetData = pageNumber === 0 ? 0 : pageNumber * pageSize + 1;
    const endGetData = pageNumber === 0 ? pageSize : initGetData + 25 - 1;
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