const router = require('express').Router()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');


const User = require('../model/User')

router.post('/signup', async(req, res) => {

    //req.body
    const {name, email, password, status, type} = req.body

    if(!name || !email || !password || !status || !type){
        res.status(422).json({error: 'Todos os campos são obrigatórios'})
    }

    //password configurations
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    let user = new User({
        name,
        email,
        password: passwordHash,
        status,
        type
    })

    //user already exists?

    const userExists = await User.findOne({email: email})
        
    if(userExists){
        return res.status(422).json({msg: 'Usuário já cadastrado. Tente o cadastro com outro e-mail'})
    }


    try{
        await User.create(user)
        
        res.status(201).json({message:'Usuário criado com sucesso'})

    }catch(error){
        res.status(500).json({error: error})
    }

})


 router.post('/login', async (req, res) =>{

    const {email, password } = req.body;

    
    if(!email){
        return res.status(422).json({msg: 'O email é obrigatório'})
    }

    if(!password){
        return res.status(422).json({msg: 'A senha é obrigatória'})
    }

   const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado!" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
        return res.status(422).json({ msg: "Senha inválida" });
      }

      try {
        res.status(200).json({ message: 'Login bem-sucedido' });
    } catch (error) {
        res.status(500).json({ error: error });
    }

})

//editar informações do usuario
router.put('/:id', async (req, res) => {

    const id = req.params.id;
    const {name, email, password, status, type} = req.body;

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = {
        name,
        email,
        password: passwordHash,
        status,
        type
    }

    if(!name || !email || !password || !status || !type){
        res.status(422).json({error: 'Todos os campos são obrigatórios'})
    }


    try{

        const updatedUser = await User.updateOne({_id: id}, user)
        if (updatedUser.matchedCount === 0) {
            return res.status(404).json({ msg: "Usuário não encontrado!" });
        }

        res.status(200).json(user);

    }catch(err){
        res.status(500).json({err:err})
    }

})

//soft delete do usuario
router.delete('/softDelete/:id', async (req, res) => {

    const id = req.params.id;
    const {status} = req.body;

    const user = { status }

    if(!user){
        res.status(422).json({error: 'Todos os campos são obrigatórios'})
    }

    try{

        const updatedUser = await User.updateOne({_id: id}, user)
        if (updatedUser.matchedCount === 0) {
            return res.status(404).json({ msg: "Usuário não encontrado!" });
        }

        res.status(200).json({msg: "Usuário deletado com sucesso"});

    }catch(err){
        res.status(500).json({err:err})
    }

    

})



//registro administradores

router.post('/admin/signup', async(req, res) => {

    //req.body
    const {name, email, password, status, type, dataInicio, area} = req.body

    if(!name || !email || !password || !status || !dataInicio || !area){
        res.status(422).json({error: 'Todos os campos são obrigatórios'})
    }

    //password configurations
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const admin = 'admin user'

    let user = new User({
        name,
        email,
        password: passwordHash,
        status,
        type: admin,
        dataInicio,
        area
    })

    //user already exists?

    const userExists = await User.findOne({email: email})
        
    if(userExists){
        return res.status(422).json({msg: 'Usuário já cadastrado. Tente o cadastro com outro e-mail'})
    }


    try{
        await User.create(user)
        
        res.status(201).json({message:'Usuário criado com sucesso'})

    }catch(error){
        res.status(500).json({error: error})
    }
    

})

//login administradores
router.post('/admin/login', async (req, res) =>{

    const {email, password, type} = req.body;

    
    if(!email){
        return res.status(422).json({msg: 'O email é obrigatório'})
    }

    if(!password){
        return res.status(422).json({msg: 'A senha é obrigatória'})
    }

   const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(404).json({ msg: "Usuário não encontrado!" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
        return res.status(422).json({ msg: "Senha inválida" });
      }

      try {
        res.status(200).json({ message: 'Login bem-sucedido' });
    } catch (error) {
        res.status(500).json({ error: error });
    }

})

//Lista de usuários
router.get('/admin/users', async (req, res) => {
    try {
      const users = await User.find()
  
      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({ erro: error })
    }
  })



module.exports = router
