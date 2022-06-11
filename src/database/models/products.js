module.exports = (sequelize, DataTypes) => {
    let alias = 'Product';
    let cols = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        brand: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        sale: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        modified_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    };

    let config = {
        tableName: 'products',
        timestamps: true,
    }

    let Product = sequelize.define(alias, cols, config);

    Product.associate = function (models) {
        Product.belongsTo(models.Brand, {
            as: 'brandId',
            foreignKey: 'brand'
        });

        Product.belongsTo(models.Sale,{
            as: 'saleId',
            foreignKey: 'sale'
        });

        Product.belongsTo(models.User, {
            as: 'createdBy',
            foreignKey: 'created_by'
        });

        Product.belongsTo(models.User, {
            as: 'modifiedBy',
            foreignKey: 'modified_by'
        });

        Product.belongsToMany(models.Image, {
            as: 'images',
            through: 'images_products',
            foreignKey: 'product_id',
            otherKey: 'image_id',
            timestamps: false
        });

        Product.belongsToMany(models.Tag, {
            as: 'tags',
            through: 'tags_products',
            foreignKey: 'product',
            otherKey: 'tag_id',
            timestamps: false
        });

        Product.belongsToMany(models.User, {
            as: 'likes',
            through: 'products_likes',
            foreignKey: 'product_id',
            otherKey: 'user_id',
            timestamps: false
        });
    };

    return Product;
}