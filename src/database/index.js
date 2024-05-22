const { Sequelize } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: path.join(__dirname, "..", "..", "database.sqlite"),
	
});

const modelDefiners = [
	require("./models/user.model"),
	require("./models/token.model")
];

for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

sequelize.sync()

sequelize.models.user.hasMany(sequelize.models.token);
sequelize.models.token.belongsTo(sequelize.models.user);

module.exports = sequelize;