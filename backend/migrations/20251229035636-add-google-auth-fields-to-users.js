'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'google_id', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true
    });
    await queryInterface.addColumn('Users', 'email', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'google_id');
    await queryInterface.removeColumn('Users', 'email');
  }
};
