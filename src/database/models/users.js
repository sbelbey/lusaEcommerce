module.exports = (sequelize, DataTypes) => {
    let alias = 'User';
    let cols = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        avatar: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        hash: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        idCard: {
            type: DataTypes.INTEGER(15),
            allowNull: true,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        card: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        activeCart: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    };

    let config = {
        tableName: 'users',
        timestamps: false
    }

    const User = sequelize.define(alias, cols, config);

    User.associate = function (models) {
        User.hasMany(models.Product, {
            as: 'productCreated',
            foreignKey: 'created_by',
        });

        User.hasMany(models.Product, {
            as: 'productModified',
            foreignKey: 'modified_by',
        });

        User.hasMany(models.Brand, {
            as: 'brandCreated',
            foreignKey: 'created_by',
        });

        User.hasMany(models.Brand, {
            as: 'brandModified',
            foreignKey: 'modified_by',
        });

        User.hasMany(models.Sale, {
            as: 'saleCreated',
            foreignKey: 'created_by',
        });

        User.hasMany(models.Sale, {
            as: 'saleModified',
            foreignKey: 'modified_by',
        });

        User.belongsTo(models.Image, {
            as: 'userAvatar',
            foreignKey: 'avatar'
        });

        User.belongsToMany(models.Product, {
            as: 'products_liked',
            through: 'products_likes',
            foreignKey: 'user_id',
            otherKey: 'product_id',
            timestamps: false
        });
        
        User.belongsToMany(models.Tag, {
            as: 'tags',
            through: 'tags_users',
            foreignKey: 'user_id',
            otherKey: 'tag_id',
            timestamps: false
        });

        User.belongsToMany(models.Cart, {
            as: 'cart',
            through: 'cart_user',
            foreignKey: 'user_id',
            otherKey: 'cart_id',
            timestamps: false
        });
    };

    return User;
}