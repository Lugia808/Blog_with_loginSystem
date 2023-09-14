<<<<<<< HEAD
const { sequelize, Sequelize } = require('./Db')

const User = sequelize.define('posts', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
=======
const {sequelize, Sequelize} = require('./Db')

const User = sequelize.define('posts',{
    
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
>>>>>>> c76c0e37270a0e00cf01abd16416dc948d2cff18
    },
    titulo: {
        type: Sequelize.STRING,
        unique: false
<<<<<<< HEAD

=======
            
>>>>>>> c76c0e37270a0e00cf01abd16416dc948d2cff18
    },
    conteudo: {
        type: Sequelize.STRING,
        unique: false
<<<<<<< HEAD
    },
    userId: {
        type: Sequelize.INTEGER,
        unique: false
        // = o número do id do usuário
    }
})

=======
    }
})

User.associate = (models) => {
    User.belongsTo(models.Setor, { foreignKey: 'id', as: 'userPost' });
  };

>>>>>>> c76c0e37270a0e00cf01abd16416dc948d2cff18

//User.sync({force: true})

module.exports = User

