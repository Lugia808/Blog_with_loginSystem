const {sequelize, Sequelize} = require('./Db')

const Friends = sequelize.define('friends',{
    
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: Sequelize.STRING,
        unique: false
            
    },
    userId: {
        type: Sequelize.INTEGER,
        unique: true
        // = o número do id do usuário
    }
})


//Friends.sync({force: true})

module.exports = Friends

