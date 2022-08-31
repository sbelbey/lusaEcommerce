const { User } = require("../database/models");
const { userFinder } = require("./services/finders");
const { paging } = require("./services/paging");

module.exports = {
  allUsers: async (req, res) => {
    try {
      if (req.query.search) {
        userFinder(req.query.search);
      } else {
        //Create the offset
        const pageOffset = req.query.page ? (req.query.page - 1) * 10 : 0;

        // Find the Sales
        let { count, rows } = await User.findAndCountAll({
          include: { all: true },
          limit: 10,
          offset: pageOffset,
        });

        let data = {
          countItems: count,
          items: rows,
        };

        paging(req, res, data, "user");
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
};
