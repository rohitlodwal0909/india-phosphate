module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("qadocumentscoas", "admin_remark", {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("qadocumentscoas", "admin_remark");
  }
};
