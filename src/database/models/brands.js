module.exports = (sequelize, DataTypes) => {
    let alias = 'Brand';
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
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        modified_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    };

    let config = {
        tableName: 'brands',
        timestamps: true,
    }

    const Brand = sequelize.define(alias, cols, config);

    Brand.associate = function (models){
        Brand.hasMany(models.Product, {
            as: 'product',
            foreignKey: 'brand'
        });

        Brand.belongsTo(models.User, {
            as: 'createdBy',
            foreignKey: 'created_by'
        });

        Brand.belongsTo(models.User, {
            as: 'modifiedBy',
            foreignKey: 'modified_by'
        });

    };

    return Brand;
}