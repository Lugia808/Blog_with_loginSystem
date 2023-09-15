const { sequelize, Sequelize } = require('./Db')

const User = sequelize.define('posts', {

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
    },
    userId: {
        type: Sequelize.INTEGER,
        unique: true
        // = o número do id do usuário
    },
}, {
    tableName: 'posts',
    timestamps: true, // Adjust as needed}
})

//User.sync({force: true})

module.exports = User

