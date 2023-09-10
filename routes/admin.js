const express = require('express')
const router = express.Router()
const User = require('../models/User');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const { error } = require('console');
const app = express();
const passport = require('passport')
const flash = require('connect-flash');

router.use(flash())

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Extração da extensão do arquivo original:
    const extensaoArquivo = file.originalname.split('.')[1];

    // Cria um código randômico que será o nome do arquivo
    const novoNomeArquivo = require('crypto')
      .randomBytes(64)
      .toString('hex')
    // Indica o novo nome do arquivo:
    cb(null, `${novoNomeArquivo}.${extensaoArquivo}`)
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true); // Aceita o arquivo
    } else {
      cb(new Error('Apenas arquivos JPEG ou PNG são permitidos!'), false);
    }
  },
});

router.get('/', (req, res) => {
  var message = []
  req.session.destroy()
  User.count()
    .then(count => {
      res.render('homezada', { message: message, count: count });
    })
    .catch(error => {
      console.error(error);
    });
})

router.get('/home', (req, res) => {
  var message = []
  if (req?.session?.passport?.user) {
    console.log(req.session.passport.user , 'Essa é a sessão do passport')
    User.findOne({
      where: {
        id: req.session.passport.user
      },
    }).then((result) => {

      if (result) {
        message.push('Seja bem vindo, ' + result.username)
        res.render('home', { result: result, message: message })
      } else {
        console.log('Sessão não encontrada')
        message.push('Sessão não encontrada 1')
        res.redirect('/')
      }
    }).catch((error) => {
      console.log('ocorreu um erro,', error)
    })
  } else {
    console.log('Sessão não encontrada')
    res.redirect('/')
  }

})

router.get('/login', (req, res) => {
  var message = '';
  res.render('login', { message: message })
})

router.post('/login', (req, res, next) => {
  
  passport.authenticate("local", {
    successRedirect: "/home", // se autenticação ocorrer com sucesso
    failureRedirect: "/login", // se ocorrer alguma falha na autenticação
    failureFlash: true,
})(req, res, next)
});


router.get('/registro', (req, res) => {
  res.render('registro')
})

router.post('/registro', upload.single('imagem'), async (req, res) => {
  try {
    const message = [];
    const username = req.body.username;
    const email = req.body.email;
    const imagem = req.file.path.toString();
    const senha = req.body.password;
    const senha_confirm = req.body.confirm_password;

    const salt = await bcrypt.genSalt(10);
    const senhahash = await bcrypt.hash(senha, salt);

    const existingUser = await User.findOne({
      where: {
        username: req.body.username
      }
    });

    if (existingUser) {
      message.push('Email já registrado');
      console.log('E-mail já registrado.');
    } else {
      if (senha !== senha_confirm) {
        message.push('As senhas não são iguais');
        console.log('As senhas não são iguais');
        res.redirect('/registro');
      } else {
        await User.create({
          username: username,
          email: email,
          perfil_img: imagem,
          password: senhahash
        }).then(()=>{
          res.redirect('login')
        });
      }
    }
  } catch (error) {
    
    console.log('Aconteceu um erro', error);
    res.render('registro', {message: message});
  }
});


module.exports = router