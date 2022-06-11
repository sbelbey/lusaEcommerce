module.exports = (sequelize, DataTypes) => {
    let alias = 'Cart';
    let cols = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    };

    let config = {
        tableName: 'carts',
        timestamps: true,
    };

    const Cart = sequelize.define(alias, cols, config);

    Cart.associate = function (models) {
        Cart.belongsToMany(models.Product, {
            as: 'product',
            through: 'carts_products',
            foreignKey: 'cart_id',
            otherKey: 'product_id',
            timestamps: false
        });

        Cart.belongsToMany(models.User, {
            as: 'user',
            through: 'cart_user',
            foreignKey: 'cart_id',
            otherKey: 'user_id',
            timestamps: false
        });
    };

    return Cart;
}