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
  const userPostsArray = []; // Defina o array aqui

  if (req?.session?.passport?.user) {
    var session = req?.session?.passport?.user;
    try {
      const count = await User.count();
      const count1 = count;

      const resultPosts = await Post.findAll({
        order: [['createdAt', 'DESC']]
      });

      res.render('homezada', {
        result: resultPosts,
        message: message,
        count1: count1,
        session: session,
      });
    } catch (erro) {
      console.log('erro: ', erro);
      res.status(500).send('Erro ao buscar dados do usuário');
    }
  } else {
    try {
      const resultPosts = await Post.findAll({
        order: [['createdAt', 'DESC']]
      });

      console.log('data: ',resultPosts[0].createdAt)

      const count = await User.count();
      const count1 = count;


      console.log('Rodando sem sessão');
      session = undefined;
      res.render('homezada', {
        message: message,
        result: resultPosts,
        count1: count1,
        session: session
      });

    }catch(error){
      console.log(error)
    }};

    })


router.get('/logout',(req, res)=>{
  req.session.destroy()
  res.redirect('/') 
})

router.get('/perfil/:id', async (req, res) => {
  var message = []

  if(req?.session?.passport?.user){
    console.log(`sessão: ${req?.session?.passport?.user}`)
  const UserFind = await User.findOne({where:{
    id: req?.session?.passport?.user
  }})
  
  if (UserFind.username === req.params.id) {
    User.findOne({
      where: {id: req.session.passport.user}, })
      .then((result) => {
      const resultado = result
      if (result) {
        message.push('Seja bem vindo(a), ' + result.username)
        User.findAll({
          where: {
            id: req.session.passport.user
          },
          include: [
            {
              model: Post,
              as: 'posts'
            }
          ],
          order: [[{ model: Post, as: 'posts' }, 'createdAt', 'DESC']] // Ordenar em ordem decrescente pela coluna 'createdAt' da tabela 'Post'
        })
        .then((user)=>{
          if(user){Post.findAll({
              where:{
                userId: req.session.passport.user
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
  }else{
    //Vendo perfil logado, mas não é o dono

    //Precisa-se ajeitar a parte de postagens do usuário
    const UserFind1 = await User.findAll({where:{username: req.params.id}});

    
    const UserFind = UserFind1[0]
    session1 = req.session.passport.user
    session = undefined
    res.render('perfil', {
      resultado: UserFind,
      session1: session1,
      session: session
    })
  }} else {
    //Vendo o perfil sem estar logado
    console.log('Sessão não encontrada');

    const UserFind1 = await User.findAll({where:{username: req.params.id}});
    const UserFind = UserFind1[0]
    session = undefined
    res.render('perfil', {
      resultado: UserFind,
      session: session
    })
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
  var message = []
  if(req?.session?.passport?.user){
  try {
    var title = req.body.titulo;
    var conteudo = req.body.conteudo;

    const userResult = await User.findOne({where: {id: req.session.passport.user}})
    const result = await Post.create({
      titulo: req.body.titulo,
      conteudo: req.body.conteudo,
      userId: req?.session?.passport?.user,
      username: userResult.username
    }).then(()=>{
      console.log('registro bem sucedido.');
      res.redirect('/postagens')
    })
  }catch(error){
      console.log(error)
      console.error(error);
      message.push('Ocorreu um erro')
      res.redirect('/')
    };
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
      res.redirect('/perfil')
    }).catch((error)=>{
      console.log('Ocorreu um erro: ', error)
    })
  }
})


router.get('/postagens',async (req, res)=>{
  var message = []
  if(req?.session?.passport?.user){
    const result = await Post.findAll({order: [['createdAt', 'DESC']]});

    
    console.log('Rodando sem sessão');
    var session = req.session.passport.user
    res.render('postagens', {
      message: message,
      result: result,
      session: session,
      session: session
    });

}else{
    const result = await Post.findAll({order: [['createdAt', 'DESC']]});
    console.log('Rodando sem sessão');
    var session = undefined;
    res.render('postagens', {
      message: message,
      result: result,
      session: session,
      session: session
    });
  }}
  
  )

router.get('/amigos', (req, res)=>{
  if (req?.session?.passport?.user) {
    
    res.render('amigos');

  }
  else{
    res.redirect('/')
  }
})

router.get('/agradecimentos', (req, res)=>{
  res.render('agradecimentos')
})

module.exports = router