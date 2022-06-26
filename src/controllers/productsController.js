const { User, Brand, Product, Sale, Tag } = require("../database/models");
const { productFinder } = require("./services/finders");
const { paging } = require("./services/paging");

const productController = {
  allProducts: async (req, res) => {
    try {
      //Looking for products by search
      if (req.query.search) {
        productFinder(req, res);
      }
      // Find all products
      else {
        //Create the offset
        const pageOffset = req.query.page ? (req.query.page - 1) * 10 : 0;

        // Find the products
        let { count, rows } = await Product.findAndCountAll({
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

module.exports = productController;
