const { User, Brand, Product, Sale, Tag } = require("../database/models");
const { Op } = require("sequelize");
const { all } = require("../routes/products");

module.exports = {
  allProducts: async (req, res) => {
    try {
      if (req.query.search) {
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

        const tagsFound = await Tag.findAll({
          where: {
            name: {
              [Op.like]: "%" + search + "%",
            },
          },
        });

        let productsByTags = [];
        for (let i = 0; i < tagsFound.length; i++) {
          productsByTags = [
            ...(await tagsFound[i].getProducts()),
            ...productsByTags,
          ];
        }

        let allProducts = [
          ...productsByTags,
          ...productsByBrand,
          ...productsFound,
        ];

        const productsWoDuplicates = [...allProducts];
        productsWoDuplicates.forEach((product, index) => {
          const copyItem = product.id;
          productsWoDuplicates.forEach((item, indice) => {
            const itemCopy = item.id;
            if (copyItem == itemCopy && index != indice) {
              productsWoDuplicates.splice(item, 1);
            }
          });
        });
        res.status(200).json(productsWoDuplicates);
      } else {
        const allProducts = await Product.findAll({ include: { all: true } });
        res.status(200).json(allProducts);
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  storageProduct: async (req, res) => {
    try {
      // Find or Creat a Brand incomming from the request
      const productBrand = await Brand.findOrCreate({
        where: { name: req.body.brandName },
        defaults: {
          created_by: req.body.userId,
        },
      });

      // Images catcher
      // let productImages = req.files

      // Create a new product
      const newProduct = await Product.create({
        name: req.body.name,
        brand: productBrand[0].dataValues.id,
        category: req.body.category,
        price: Number(req.body.price),
        stock: Number(req.body.stock),
        active: req.body.active,
        sale: req.body.saleId,
        description: req.body.description,
        // images: productImages.map(image => Object({url: image.filename})),
        created_by: req.body.userId,
      });

      // Tag cleaner incomming from the request
      const productTags = req.body.tags;
      const productTagsArray = productTags
        .toLowerCase()
        .replace(/,/g, "")
        .split(" ");

      // Set product tags
      let tagCreated;
      let tagUses;
      productTagsArray.forEach(async (tag) => {
        tagCreated = await Tag.findOrCreate({
          where: { name: tag },
        });
        tagUses = await Tag.findByPk(tagCreated[0].dataValues.id);
        await tagUses.addProduct(newProduct.id);
      });

      return res.status(200).json(newProduct);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  getProduct: async (req, res) => {
    try {
      const productId = Number(req.params.id);
      const productById = await Product.findByPk(productId, {
        include: { all: true },
      });
      return res.status(200).json(productById);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      //Find product
      const productId = Number(req.params.id);
      const productById = await Product.findByPk(productId, {
        include: { all: true },
      });

      //Remove old tags
      productById.tags.map((tag) => {
        productById.removeTags(tag.id);
      });

      // Tag cleaner incomming from the request
      const productTags = req.body.tags;
      const productTagsArray = productTags
        .toLowerCase()
        .replace(/,/g, "")
        .split(" ");

      // Set product tags
      let tagCreated;
      let tagUses;
      productTagsArray.forEach(async (tag) => {
        tagCreated = await Tag.findOrCreate({
          where: { name: tag },
        });
        tagUses = await Tag.findByPk(tagCreated[0].dataValues.id);
        await tagUses.addProduct(productById.id);
      });

      // Find or Creat a Brand incomming from the request
      const productBrand = await Brand.findOrCreate({
        where: { name: req.body.brandName },
        defaults: {
          created_by: req.body.userId,
        },
      });

      //Update the Product
      const productModificated = await productById.update(
        {
          name: req.body.name,
          brand: productBrand[0].dataValues.id,
          category: req.body.category,
          price: Number(req.body.price),
          stock: Number(req.body.stock),
          active: req.body.active,
          sale: req.body.saleId,
          description: req.body.description,
          // images: productImages.map(image => Object({url: image.filename})),
          modified_by: req.body.userId,
        },
        { include: { all: true } }
      );

      res.status(200).json(productModificated);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  findProduct: async (req, res) => {},

  eraseProduct: async (req, res) => {
    try {
      const productId = Number(req.params.id);
      const productById = await Product.findByPk(productId);

      productById
        ? productById.destroy()
        : res.status(404).json({ message: "Product does not exist" });

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
};
