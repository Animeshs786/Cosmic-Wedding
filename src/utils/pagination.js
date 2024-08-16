const pagination = async (
  CurrentPage = 1,
  currentLimit = 10,
  Model,
  role = null,
  filter = {}
) => {
  const page = Number(CurrentPage);
  const limit = Number(currentLimit);
  let totalResult;
  const skip = (page - 1) * limit;

  if (role) {
    filter.role = role;
    totalResult = await Model.countDocuments(filter);
  } else {
    totalResult = await Model.countDocuments(filter);
  }

  const toatalPage = Math.ceil(totalResult / limit);
  return { limit, skip, totalResult, toatalPage };
};

module.exports = pagination;
