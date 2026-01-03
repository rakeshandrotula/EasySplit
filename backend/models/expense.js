'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    static associate(models) {
      Expense.belongsTo(models.Group, { foreignKey: 'group_id' });
      Expense.belongsTo(models.User, { foreignKey: 'paid_by', as: 'Payer' });
      Expense.hasMany(models.Split, { foreignKey: 'expense_id' });
    }
  }
  Expense.init({
    group_id: DataTypes.INTEGER,
    paid_by: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    description: DataTypes.STRING,
    date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Expense',
  });
  return Expense;
};