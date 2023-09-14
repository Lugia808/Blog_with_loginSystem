const { sequelize, Sequelize } = require('./Db')


const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
<<<<<<< HEAD
    autoIncrement: true//,
    //references: { model: 'post', key: 'codigo' }
=======
    autoIncrement: true,
    references:{model: 'post', key: 'codigo'}
>>>>>>> c76c0e37270a0e00cf01abd16416dc948d2cff18
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
<<<<<<< HEAD

=======
  
>>>>>>> c76c0e37270a0e00cf01abd16416dc948d2cff18
}, {
  tableName: 'users', // Nome da tabela no banco de dados
  timestamps: false // Desativar campos de data de criação/atualização padrões
})

const Post = require('./Post')
<<<<<<< HEAD
=======

User.hasMany(Post, { foreignKey: 'id', as: 'posts' });

>>>>>>> c76c0e37270a0e00cf01abd16416dc948d2cff18

//User.sync({force: true})

module.exports = User