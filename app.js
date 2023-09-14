const express = require('express');
const app = express();
//Require session para criar sessões pro usuário
const session = require('express-session')
//view engine handlebars
const handlebars = require('express-handlebars')
//ORM
const sequelize = require('./models/Db')
//Bodyparser facilita o transporte de informações
const bodyParser = require('body-parser')
//Tabela User
const User = require('./models/User')
const path = require('path')
const passport = require('passport')
const flash = require('connect-flash');
require('./config/auth')(passport)

app.use('/uploads', express.static('uploads'))

app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false,
  }));

  app.use(passport.initialize())
  app.use(passport.session())


  app.use(flash())

app.engine("handlebars", handlebars.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use((req, res, next) =>{
    next()
})

app.use(express.static('public'))

// Configuração de rotas
const router = require('./routes/admin'); // Suponha que você tenha um arquivo 'routes.js' para definir suas rotas
app.use('/', router);

const port = 3000
app.listen(port, () =>{
    console.log(`O servidor está rodando na porta: ${port}`)
})