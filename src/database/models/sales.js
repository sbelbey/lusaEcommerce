module.exports = (sequelize, DataTypes) => {
    let alias = 'Sale';
    let cols = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        discount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
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
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        modified_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    };
    let config = {
        tableName: 'sales',
        timestamps: true,
    };

    const Sale = sequelize.define(alias, cols, config);

    Sale.associate = function (models) {

        Sale.belongsTo(models.User, {
            as: 'createdBy',
            foreignKey: 'created_by'
        });

        Sale.belongsTo(models.User, {
            as: 'modifiedBy',
            foreignKey: 'modified_by'
        })

        Sale.hasMany(models.Product, {
            as: 'product',
            foreignKey: 'sale'
        });

    };

    return Sale;
}