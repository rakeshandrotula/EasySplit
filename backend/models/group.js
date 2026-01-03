'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.belongsTo(models.User, { foreignKey: 'created_by', as: 'Creator' });
      Group.hasMany(models.GroupMember, { foreignKey: 'group_id' });
      Group.belongsToMany(models.User, { through: models.GroupMember, foreignKey: 'group_id' });
      Group.hasMany(models.Expense, { foreignKey: 'group_id' });
    }
  }
  Group.init({
    group_name: DataTypes.STRING,
    category: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    currency: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};