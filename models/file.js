module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
      allowEmpty: false,
    },
    data: {
      type: DataTypes.BLOB,
      allowNull: false,
      allowEmpty: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
      allowEmpty: false,
    },
  });

  File.associate = (models) => {
    File.belongsTo(models.User, {
      as: 'file',
      foreignKey: 'userId',
    });
  };
  return File;
};
