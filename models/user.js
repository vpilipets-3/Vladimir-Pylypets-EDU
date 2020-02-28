module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
    },
    lastName: {
      type: DataTypes.STRING,
      field: 'last_name',
    },
    lastActivity: {
      type: DataTypes.STRING,
      field: 'last_activity',
    },
    managerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      allowEmpty: false,
      field: 'manager_id',
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Event, {
      as: 'events',
      foreignKey: 'userId',
      onDelete: 'cascade',
    });

    User.belongsTo(models.Manager, {
      as: 'user',
      foreignKey: 'manager_id',
    });
  };

  return User;
};
