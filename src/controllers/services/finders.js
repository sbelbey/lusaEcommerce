const { User, Brand, Product, Sale, Tag } = require("../../database/models");
const { Op } = require("sequelize");
const { paging } = require("./paging");

module.exports = {
  productFinder: async (req, res) => {
    try {
      //Catch the query string
      const search = req.query.search;

      //Look for the products by the search
      const productsFound = await Product.findAll({
        include: { all: true },
        where: {
          [Op.or]: [
            { name: { [Op.like]: "%" + search + "%" } },
            { category: { [Op.like]: "%" + search + "%" } },
            { description: { [Op.like]: "%" + search + "%" } },
          ],
          active: true,
        },
      });

      // Look for Bands matchs
      const brandsFound = await Brand.findAll({
        where: {
          name: {
            [Op.like]: "%" + search + "%",
          },
        },
      });
      let allBrandsIds;
      brandsFound
        ? (allBrandsIds = await brandsFound.map((brand) => brand.id))
        : [];

      //Find all products on brands
      let productsByBrand = [];
      for (let i = 0; i < allBrandsIds.length; i++) {
        productsByBrand = [
          ...(await Product.findAll({
            include: { all: true },
            where: { brand: allBrandsIds[i] },
          })),
          ...productsByBrand,
        ];
      }

      // Look for tags matchs
      const tagsFound = await Tag.findAll({
        where: {
          name: {
            [Op.like]: "%" + search + "%",
          },
        },
      });

      //Getting the products by the tags.
      let productsByTags = [];
      for (let i = 0; i < tagsFound.length; i++) {
        productsByTags = [
          ...(await tagsFound[i].getProducts()),
          ...productsByTags,
        ];
      }

      // Adding all the results
      let allProducts = [
        ...productsByTags,
        ...productsByBrand,
        ...productsFound,
      ];

      // Cleaning the resulted array
      allProducts.forEach((product, index) => {
        const copyItem = product.id;
        allProducts.forEach((item, indice) => {
          const itemCopy = item.id;
          if (copyItem == itemCopy && index != indice) {
            allProducts.splice(item, 1);
          }
        });
      });

      allProducts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

      let data = {
        countItems: allProducts.length,
        items: allProducts,
      };

      paging(req, res, data, "product");
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  salesFinder: async (req, res) => {
    try {
      const search = req.query.search;
      let salesFound = await Sale.findAll({
        include: { all: true },
        where: {
          [Op.or]: [
            { name: { [Op.like]: "%" + search + "%" } },
            { discount: { [Op.like]: "%" + search + "%" } },
          ],
          active: true,
        },
      });

      salesFound = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

      let data = {
        countItems: salesFound.length,
        items: salesFound,
      };

      paging(req, res, data, "sale");
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  userFinder: async (req, res) => {
    try {
      const { search } = req.query;
      let usersFound = await User.findAll({
        include: { all: true },
        where: {
          [Op.or]: [
            { name: { [Op.like]: "%" + search + "%" } },
            { lastName: { [Op.like]: "%" + search + "%" } },
            { email: { [Op.like]: "%" + search + "%" }}
          ],
          active: true,
        },
      });

      usersFound = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

      let data = {
        countItems: usersFound.length,
        items: usersFound,
      };

      paging(req, res, data, "user");
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
};
