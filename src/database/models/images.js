module.exports = (sequelize, DataTypes) => {
    let alias = 'Image';
    let cols = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        url: {
            type: DataTypes.STRING(40),
            allowNull: false,
        }
    };

    let config = {
        tableName: 'images',
        timestamps: false,
    }

    const Image = sequelize.define(alias, cols, config);

    Image.associate = function (models) {

        Image.hasMany(models.User, {
            as: 'user',
            foreignKey: 'avatar'
        })

        Image.belongsToMany(models.Product, {
            as: 'products',
            through: 'images_products',
            foreignKey: 'image_id',
            otherKey: 'product_id',
            timestamps: false
        });
    };

    return Image;
}