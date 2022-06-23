const { User, Brand, Product, Sale, Tag } = require("../database/models");

module.exports = {
  allProducts: async (req, res) => {
    try {
      if (
        req.query.name ||
        req.query.brandName ||
        req.query.category ||
        req.query.active ||
        req.query.tag
      ) {
        this.findProduct;
      } else {
        let allProducts = await Product.findAll({ include: { all: true } });
        res.status(200).json(allProducts);
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  storageProduct: async (req, res) => {
    try {
      // Find or Creat a Brand incomming from the request
      let productBrand = await Brand.findOrCreate({
        where: { name: req.body.brandName },
        defaults: {
          created_by: req.body.userId,
        },
      });

      // Images catcher
      // let productImages = req.files

      // Create a new product
      let newProduct = await Product.create({
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
      let productTags = req.body.tags;
      let productTagsArray = productTags
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
      let productId = Number(req.params.id);
      let productById = await Product.findByPk(productId, {
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
      let productId = Number(req.params.id);
      let productById = await Product.findByPk(productId, {
        include: { all: true },
      });

      //Remove old tags
      productById.tags.map((tag) => {
        productById.removeTags(tag.id);
      });

      // Tag cleaner incomming from the request
      let productTags = req.body.tags;
      let productTagsArray = productTags
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
      let productBrand = await Brand.findOrCreate({
        where: { name: req.body.brandName },
        defaults: {
          created_by: req.body.userId,
        },
      });

      //Update the Product
      let productModificated = await productById.update(
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
      let productId = Number(req.params.id);
      let productById = await Product.findByPk(productId);

      productById
        ? productById.destroy()
        : res.status(404).json({ message: "Product does not exist" });

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
};
