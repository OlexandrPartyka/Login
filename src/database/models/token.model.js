const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define("token", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        token: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: DataTypes.NOW,
        }
    });
};