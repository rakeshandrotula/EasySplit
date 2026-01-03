'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Settlement extends Model {
    static associate(models) {
      Settlement.belongsTo(models.User, { foreignKey: 'sender_id', as: 'Sender' });
      Settlement.belongsTo(models.User, { foreignKey: 'receiver_id', as: 'Receiver' });
    }
  }
  Settlement.init({
    sender_id: DataTypes.INTEGER,
    receiver_id: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    upi_txn_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Settlement',
  });
  return Settlement;
};