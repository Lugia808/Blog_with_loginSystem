const express = require('express')
const router = express.Router()
const User = require('../models/User');
const Post = require('../models/Post');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const { error } = require('console');
const app = express();
const passport = require('passport')
const flash = require('connect-flash');
const Friends = require('../models/Friends');

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



//REVISAR

router.get('/', async (req, res) => {
  var message = [];
  if (req?.session?.passport?.user) {
    var session = req?.session?.passport?.user;
    console.log('Sessão:', session);
    try {
      const count = await User.count();
      const count1 = count;
      const result = await Post.findAll({
        include: {
          model: User,
          as: 'user',
        },
      }); 

      const userMap = {};
      result.forEach((post) => {
        if (post && post.dataValues && post.dataValues.user && post.dataValues.user.dataValues) {
            const userId = post.dataValues.id;
            const username = post.dataValues.user.dataValues.username;
            userMap[userId] = username;
        } else {
            console.error('Invalid post object:')
        }
    });
    ;
      res.render('homezada', {
        message: message,
        count1: count1,
        result: result,
        session: session,
        userMap: userMap,
      });
    } catch (error) {
      console.error('Ocorreu um erro ao buscar os dados', error);
      res.status(500).send('Erro ao buscar dados');
    }
  } else {
    try {
      const result = await Post.findAll({
        include: {
          model: User,
          as: 'user',
        },
      });

      console.log('TESTE')
      
      const userMap = {};
      result.forEach((post) => {
        if (post.dataValues.user) {
            const userId = post.dataValues.id;
            const username = post.dataValues.user.dataValues.username;
            userMap[userId] = username;
            console.log(userId)
            console.log('testes', username)
        } else {
            console.error('Número de post desconhecido');
        }
    });
    

      const count = await User.count();
      const count1 = count;
      console.log('Rodando sem sessão');
      session = undefined;
      res.render('homezada', {
        message: message,
        count1: count1,
        result: result,
        session: session,
        userMap: userMap,
      });
    } catch (error) {
      console.error('Ocorreu um erro ao buscar os dados', error);
      res.status(500).send('Erro ao buscar dados');
    }
  }
});


router.get('/logout',(req, res)=>{
  req.session.destroy()
  res.redirect('/') 
})

router.get('/perfil/:id', (req, res) => {
  var message = []
  console.log(req.params.id)
  console.log(req?.session?.passport?.user)
  if (req?.session?.passport?.user == req.params.name) {
    User.findOne({
      where: {id: req.session.passport.user}, })
      .then((result) => {
      const resultado = result
      if (result) {
        message.push('Seja bem vindo(a), ' + result.username)
        User.findAll( {where: {id: req.session.passport.user},
          include: [{
              model: Post,
            as: 'posts'
          },]
        })
        .then((user)=>{
          if(user){Post.findAll({
              where:{
                userId: user[0].id
              }})
              .then((result1)=>{
                res.render('perfil', { 
                  resultado: resultado, 
                  message: message,
                  posts: result1
                })
              }).catch((error)=>{
                console.log('Ocorreu um erro ao buscar os usuários', error)
              })
          }
          else{
            console.log('erro')
          }
        }).catch((error)=>{
          console.log(error)
        })
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
  var session = req?.session?.passport?.user
  if (req?.session?.passport?.user) {
    res.redirect('/')
  }
  var message = '';
  res.render('login', { message: message, session: session})
})

router.post('/login', (req, res, next) => {
  var message = []
  passport.authenticate("local", {

    successRedirect: "/",  // se autenticação ocorrer com sucesso
    failureRedirect: "/login",// se ocorrer alguma falha na autenticação
    failureFlash: true,
})(req, res, next)
});


router.get('/registro', (req, res) => {
  res.render('registro')
})

router.post('/registro', upload.single('imagem'), async (req, res) => {
  var message = []
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

router.get('/postagem/add', (req, res)=>{
  res.render('postagemAdd')
})

router.post('/postagem/add', async (req, res) => {
  try {
    var title = req.body.titulo;
    var conteudo = req.body.conteudo;

    const result = await Post.create({
      titulo: req.body.titulo,
      conteudo: req.body.conteudo,
      userId: req?.session?.passport?.user
    });

    // Respond with a success message or redirect to another page
    res.redirect('/')
  } catch (error) {
    console.error(error);
    // Handle the error and respond accordingly
    res.status(500).send('Internal Server Error');
  }
});


router.get('/postagem/add', (req, res)=>{
  var message = []
  if(req?.session?.passport?.user){
  res.render('postagemAdd')
  }else{
    message.push('Faça login para continuar')
    res.render('login', {message: message})
    console.log('Sessão não cadastrada')
  } 
})

router.post('/postagem/add', async (req, res) => {
  var message = []
  if(req?.session?.passport?.user){
  try {
    var title = req.body.titulo;
    var conteudo = req.body.conteudo;


    const result = await Post.create({
      titulo: req.body.titulo,
      conteudo: req.body.conteudo,
      userId: req.session.passport.user
    });

    res.redirect('/')
  }catch (error) {
    console.error(error);

    res.status(500).send('Internal Server Error');
  }

  }else{
    message.push('Faça login para continuar')
    res.render('login', {message: message})
    console.log('Sessão não cadastrada')
  } 
});

router.post('/deletarpost/:id', (req, res)=>{
  if(req.session.passport.user){
    Post.destroy({
      where: {
        id: req.params.id
      }
    }).then(()=>{
      res.redirect('/')
    }).catch((error)=>{
      console.log('Ocorreu um erro: ', error)
    })
  }
})


router.get('/postagens',async (req, res)=>{
  var message = []
  try {
    const result = await Post.findAll({
      include: {
        model: User,
        as: 'user',
      },
    });
    const userMap = {};
    result.forEach((post) => {
      if (post.dataValues.user) {
          const userId = post.dataValues.id;
          const username = post.dataValues.user.dataValues.username;
          userMap[userId] = username;
      } else {
          console.error('Número de post desconhecido');
      }
  });
    const count = await User.count();
    console.log('Rodando sem sessão');
    session = undefined;
    res.render('postagens', {
      message: message,
      count1: count1,
      result: result,
      session: session,
      userMap: userMap,
    });
  } catch (error) {
    console.error('Ocorreu um erro ao buscar os dados', error);
    res.status(500).send('Erro ao buscar dados');
  }
})

router.get('/amigos', (req, res)=>{
  if (req?.session?.passport?.user) {
    User.findOne({
      where: {id: req.session.passport.user}, })
      .then((result) => {
      const resultado = result
      if (result) {
        User.findAll( {where: {id: req.session.passport.user},
          include: [{
              model: Post,
            as: 'posts'
          },]
        })
        .then((user)=>{
          if(user){Friends.findAll({
              where:{
                userId: user[0].id
              }})
              .then((result1)=>{
                res.render('amigos', { 
                  resultado: resultado,
                  posts: result1
                })
              }).catch((error)=>{
                console.log('Ocorreu um erro ao buscar os usuários', error)
              })
          }
          else{
            console.log('erro')
          }
        }).catch((error)=>{
          console.log(error)
        })
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

module.exports = router