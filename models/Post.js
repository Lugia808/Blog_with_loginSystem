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
        unique: false
        // = o número do id do usuário
    },
    username: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    }
}, {
    tableName: 'posts',
    timestamps: true, // Adjust as needed}
})

//User.sync({force: true})

module.exports = User

