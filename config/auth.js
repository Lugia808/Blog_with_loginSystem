const localStrategy = require('passport-local')
const {sequelize, Sequelize} = require('../models/Db')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

require('../models/User')

module.exports = function(passport){
    var message = []
    passport.use(new localStrategy({usernameField: 'username'}, (username, senha, done)=>{

        User.findOne({where: {username: username}}).then((usuario)=>{
            if(!usuario){

                message.push('Esta conta não existe')
                return done(null, false, {message: 'Esta conta não existe'})
            }

            bcrypt.compare(senha, usuario.dataValues.password, (erro, batem)=>{
                if(batem){
                    message.push('Logado com sucesso')
                    return done(null, usuario)
                }else{
                    return done(null, false, {message: 'Senha incorreta'})
                }
            })
        })
    }))

passport.serializeUser((user, done)=>{
    console.log('pegando 1')
    console.log('ID do usúario (passport) ',user.id)
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    console.log('pegando 2');
    User.findByPk(id)
        .then((user) => {
            done(null, user);
        })
        .catch((err) => {
            done(err, null);
        });
});

}