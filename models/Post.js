const {sequelize, Sequelize} = require('./Db')

const User = sequelize.define('posts',{
    
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titulo: {
        type: Sequelize.STRING,
        unique: false
            
    },
    conteudo: {
        type: Sequelize.STRING,
        unique: false
    }
})

User.associate = (models) => {
    User.belongsTo(models.Setor, { foreignKey: 'id', as: 'userPost' });
  };


//User.sync({force: true})

module.exports = User

