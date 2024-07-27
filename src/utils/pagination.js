const pagination = async (
  CurrentPage = 1,
  currentLimit = 10,
  Model,
  role = null
) => {
  const page = Number(CurrentPage);
  const limit = Number(currentLimit);
  let totalResult;
  const skip = (page - 1) * limit;

  if (role) {
    totalResult = await Model.countDocuments({ role });
  } else {
    totalResult = await Model.countDocuments();
  }

  const toatalPage = Math.ceil(totalResult / limit);
  return { limit, skip, totalResult, toatalPage };
};

module.exports = pagination;
