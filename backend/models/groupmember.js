'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupMember extends Model {
    static associate(models) {
      GroupMember.belongsTo(models.User, { foreignKey: 'user_id' });
      GroupMember.belongsTo(models.Group, { foreignKey: 'group_id' });
    }
  }
  GroupMember.init({
    group_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    is_admin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'GroupMember',
  });
  return GroupMember;
};