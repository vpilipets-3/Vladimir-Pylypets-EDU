module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    eventDescription: {
      type: DataTypes.STRING,
      field: 'event_description',
      allowNull: false,
      allowEmpty: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
  });
  return Event;
};
