module.exports = (sequelize, DataTypes) => {
  const Manager = sequelize.define('Manager', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      allowEmpty: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      allowEmpty: false,
    },
    firstName: {
      type: DataTypes.STRING,
      field: 'first_name',
      allowNull: false,
      allowEmpty: false,
    },
    lastName: {
      type: DataTypes.STRING,
      field: 'last_name',
      allowNull: false,
      allowEmpty: false,
    },
  });

  Manager.associate = (models) => {
    Manager.hasMany(models.User, {
      as: 'users',
      foreignKey: 'manager_id',
    });
  };
  return Manager;
};
