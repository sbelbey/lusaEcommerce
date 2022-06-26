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

      let countPages = 1;
      let nextPage = null;
      let prevPage = null;
      let productToSend = productsWoDuplicates;

      // Paging the results
      if (productsWoDuplicates.length > 10) {
        //Calc the count of pages

        Number.isInteger(productsWoDuplicates.length / 10)
          ? (countPages = productsWoDuplicates.length / 10)
          : (countPages = Math.trunc(productsWoDuplicates.length / 10) + 1);

        if (req.query.page) {
          //Calc the previous page
          req.query.page > 1
            ? (prevPage = "api/product/?page=" + (Number(req.query.page) - 1))
            : null;

          //Calc the next page
          req.query.page < countPages
            ? (nextPage = "api/product/?page=" + (Number(req.query.page) + 1))
            : null;

          productToSend = productsWoDuplicates.slice(
            (req.query.page - 1) * 10,
            req.query.page * 10
          );
        } else {
          nextPage = "api/product/?page=2";
          productToSend = productsWoDuplicates.slice(0, 10);
        }
      }
      res.status(200).json(
        Object({
          info: {
            count: productsWoDuplicates.length,
            pages: countPages,
            prev: prevPage,
            next: nextPage,
          },
          products: productToSend,
        })
      );
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
};
