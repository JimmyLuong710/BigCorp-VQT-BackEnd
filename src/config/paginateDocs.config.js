const extractQueryFromRequest = (req) => {
  let sort = req.query.sort ? req.query.sort : "-createdAt";
  let page = req.query.page ? req.query.page : 1;
  let limit = req.query.limit ? req.query.limit : 6;

  return { sort, page, limit };
};

const getResultPaginate = (data) => {
  return {
    docs: data.docs,
    pagination: {
      totalDocs: data.totalDocs,
      limit: data.limit,
      totalPages: data.totalPages,
      page: data.page,
      hasPrevPage: data.hasPrevPage,
      hasNextPage: data.hasNextPage,
    },
  };
};

module.exports = {
  extractQueryFromRequest,
  getResultPaginate,
};
