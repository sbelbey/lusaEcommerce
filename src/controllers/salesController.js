const { Sale } = require("../database/models");
const { paging } = require("./services/paging");
const { salesFinder } = require("./services/finders");

module.exports = {
  allSales: async (req, res) => {
    try {
      if (req.query.search) {
        salesFinder(req, res);
      } else {
        //Create the offset
        const pageOffset = req.query.page ? (req.query.page - 1) * 10 : 0;

        // Find the Sales
        let { count, rows } = await Sale.findAndCountAll({
          include: { all: true },
          limit: 10,
          offset: pageOffset,
        });

        let data = {
          countItems: count,
          items: rows,
        };

        paging(req, res, data);
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
};
