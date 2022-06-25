const { User, Brand, Product, Sale, Tag } = require("../database/models");
const { Op } = require("sequelize");

module.exports = {
  finder: async (req, res) => {
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
      let productsWoDuplicates = [...allProducts];
      productsWoDuplicates.forEach((product, index) => {
        const copyItem = product.id;
        productsWoDuplicates.forEach((item, indice) => {
          const itemCopy = item.id;
          if (copyItem == itemCopy && index != indice) {
            productsWoDuplicates.splice(item, 1);
          }
        });
      });

      // Paging the results
      if (productsWoDuplicates.length > 10) {
        req.query.page
          ? res.status(200).json({
              products: productsWoDuplicates.slice(
                (req.query.page - 1) * 10,
                req.query.page * 10
              ),
            })
          : res
              .status(200)
              .json({ products: productsWoDuplicates.slice(0, 10) });
      }
      res.status(200).json(productsWoDuplicates);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
};
