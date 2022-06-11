module.exports = (sequelize, DataTypes) => {
    let alias = 'Tag';
    let cols = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(25),
            allowNull: false,
        }
    };
    let config = {
        tableName: 'tags',
        timestamps: false
    }

    const Tag = sequelize.define(alias, cols, config);

    Tag.associate = function (models) {
        Tag.belongsToMany(models.Product, {
            as: 'products',
            through: 'tags_products',
            foreignKey: 'tag_id',
            otherKey: 'product',
            timestamps: false
        });

        Tag.belongsToMany(models.User, {
            as: 'users',
            through: 'tags_users',
            foreignKey: 'tag_id',
            otherKey: 'user_id',
            timestamps: false
        });
    };

    return Tag;
}