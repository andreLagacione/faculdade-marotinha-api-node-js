exports.pagination = (pageNumber, pageSize, totalElements) => {
    const totalPages = Math.round(totalElements / pageSize);
    const isFirstPage = pageNumber === 0 ? true : false;
    const isLastPage = pageNumber < totalPages ? false : true;

    return {
        content: [],
        totalElements: totalElements,
        totalPages: totalPages,
        last: isLastPage,
        first: isFirstPage,
        size: pageSize || 25,
        number: 0,
        numberOfElements: pageSize || 25
    }
}