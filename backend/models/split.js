'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Split extends Model {
    static associate(models) {
      Split.belongsTo(models.Expense, { foreignKey: 'expense_id' });
      Split.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Split.init({
    expense_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    amount_owed: DataTypes.DECIMAL,
    share_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Split',
  });
  return Split;
};