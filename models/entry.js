module.exports = function(sequelize, DataTypes) {
  var Entry = sequelize.define("Entry", {
    entryId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255]
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      len: [1]
    },
    createdDate: {
      type: DataTypes.DATE
    },
    changedDate: {
      type: DataTypes.DATE
    },
    isPrivate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  });

  Entry.associate = function(models) {
    // We're saying that a Post should belong to an User
    // A Entry can't be created without an due to the foreign key constraint
    Entry.belongsTo(models.User, {
      foreignKey: {
        name: "userId",
        allowNull: false
      }
    });
  };

  return Entry;
};
