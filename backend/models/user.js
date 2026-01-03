'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Group, { foreignKey: 'created_by', as: 'CreatedGroups' });
      User.hasMany(models.GroupMember, { foreignKey: 'user_id' });
      User.belongsToMany(models.Group, { through: models.GroupMember, foreignKey: 'user_id' });
      User.hasMany(models.Expense, { foreignKey: 'paid_by', as: 'PaidExpenses' });
      User.hasMany(models.Split, { foreignKey: 'user_id', as: 'Splits' });
      User.hasMany(models.Settlement, { foreignKey: 'sender_id', as: 'SentSettlements' });
      User.hasMany(models.Settlement, { foreignKey: 'receiver_id', as: 'ReceivedSettlements' });
    }
  }
  User.init({
    name: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    upi_id: DataTypes.STRING,
    avatar_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};