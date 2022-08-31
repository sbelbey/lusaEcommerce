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

        paging(req, res, data, "sale");
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  storageSale: async (req, res) => {
    try {
      //Create the sales
      const newSales = await Sale.create({
        discount: Number(req.body.discount),
        name: req.body.name,
        active: req.body.active,
        created_by: req.body.userId,
      });

      res.status(200).json(newSales);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  getSale: async (req, res) => {
    try {
      const saleId = req.params.id;

      const foundSales = await Sale.findByPk(saleId, {
        include: { all: true },
      });

      res.status(200).json(foundSales);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  updateSale: async (req, res) => {
    try {
      const saleId = req.params.id;
      const saleById = await Sale.findByPk(saleId)
      const saleModificated = await saleById.update({
        discount: Number(req.body.discount),
        name: req.body.name,
        active: req.body.active,
        modified_by: req.body.userId,
      })

      res.status(200).json(saleModificated);
    } catch (error) {
      res.status(500).send({message: error.message})
    }
  },

  eraseSale: async (req, res) => {
    try {
      const saleId = req.params.id;
      const saleById = await Sale.findByPk(saleId);

      saleById ? saleById.destroy() : res.status(404).json({message: "The sale does not exist."});

      res.status(200).json({message: "The sale was deleted successfully."})
    } catch (error) {
      res.status(500).send({message: error.message})
    }
  }
};
