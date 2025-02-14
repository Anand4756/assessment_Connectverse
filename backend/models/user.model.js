const { DataTypes, INTEGER, STRING } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true, //  username is unique
  },
  password: { type: DataTypes.STRING },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // User is unverified by default
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // email is unique
  },
});

User.sync({ force: false })

  .then(() => {
    console.log("User table created");
  })
  .catch((error) => {
    console.error("Error creating User table:", error);
  });

module.exports = User;
