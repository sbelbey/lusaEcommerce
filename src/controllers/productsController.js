const {User, Brand, Product, Sale, Tag} = require('../database/models')

module.exports = {
    allProducts : async (req, res) => {
        //  FALTA EL TRY CHATCH <-----
        try {
            let user = await User.findAll({include: {all: true}});
            res.send(user);
            
        } catch (error) {
            res.status(500).send({message: error.message})
        }

    },

    createProduct: async (req, res) => {

    },

    productStorage: async (req, res) => {
        try {
            // Find or Creat a Brand incomming from the request
            let productBrand = await Brand.findOrCreate({
                where: 
                    {name: req.body.brandName},
                defaults: 
                    {
                        created_by: req.body.userId,
                    }
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
            let productTagsArray = productTags.toLowerCase().replace(/,/g, '').split(' ');


            // Set product tags
            let tagCreated;
            let tagUses;
            productTagsArray.forEach(async tag => {
                tagCreated = await Tag.findOrCreate({
                    where: {name: tag}
                    });
                tagUses = await Tag.findByPk(tagCreated[0].dataValues.id)
                await tagUses.addProduct(newProduct.id)
            });
            
            return res.status(200).send(newProduct);

        } catch (error) {
            res.status(500).send({message: error.message})
        }
    }
    
}