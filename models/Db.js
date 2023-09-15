const Sequelize = require('sequelize')

const sequelize = new Sequelize('users', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }



  module.exports = {
    Sequelize : Sequelize,
    sequelize : sequelize
  }

const Post = require('./Post')
const User = require('./User')
const Friends = require('./Friends')

User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Friends, { foreignKey: 'userId', as: 'friends' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'userfriend' });








