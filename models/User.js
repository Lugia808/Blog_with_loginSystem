const { sequelize, Sequelize } = require('./Db')

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  perfil_img: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  
}, {
  tableName: 'users', // Nome da tabela no banco de dados
  timestamps: false // Desativar campos de data de criação/atualização padrões
})

//User.sync({force: true})

module.exports = User
