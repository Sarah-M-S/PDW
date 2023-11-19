const router = require('express').Router()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');


const User = require('../model/User')

module.exports = router =>{
    /**
     * @swagger
     * /signup
     *  post:
     *      tags:
     *        - User
     *         description: Cadastrar novo usuário
     *         produces: 
     *          -application/json
     *      responses:
     *          422:
     *              description: Todos os campos são obrigatórios
     *              schema:
     *                 $ref: '#/components/schemas/User'
     *          422:
     *              description: Usuário já cadastrado. Tente o cadastro com outro e-mail
     *               schema:
     *                 $ref: '#/components/schemas/User'
     *          201:
     *              description: Usuário cadastrado com sucesso
     *               schema:
     *                 $ref: '#/components/schemas/User'
     *          500:
     *              description: Erro interno 
     *               schema:
     *                 $ref: '#/components/schemas/User'
     *              
     * post:
     *      tags:
     *        -User:
     *         description: Login
     *          produces:
     *              -application/json
     *          responses:
     *              422:
     *                  description: O e-mail é obrigatório
     *                  schema:
     *                      $ref: '#components/schemas/User'
     *              422:
     *                  description: A senha é obrigatória
     *                  schema:
     *                  $ref: #components/schemas/User
     *              404:
     *                  description: Usuário não encontrado
     *                  schema:
     *                  $ref: #components/schemas/User
     *              422:
     *                  description: Senha inválida
     *                  schema:
     *                  $ref: #components/schemas/User
     *              200:
     *                  description: Login bem sucedido
     *                  schema:
     *                  $ref: #components/schemas/User
     *              500:
     *                  description: Erro interno
     *                  schema:
     *                  $ref: #components/schemas/User
     * put:
     *      tags:
     *        -Category:
     *         description: Editar categoria
     *          produces:
     *              -application/json
     *          responses:
     *              200:
     *                  description: Categorya editada
     *                  schema:
     *                      $ref: '#components/schemas/Category'
     *              500:
     *                  description: Erro interno do servidor
     *                  schema:
     *                  $ref: #components/schemas/Category
     * put:
     *      tags:
     *        -User:
     *         description: Editar informações do usuário
     *          produces:
     *              -application/json
     *          responses:
     *              422:
     *                  description: Todos os campos são obrigatórios
     *                  schema:
     *                      $ref: '#components/schemas/User'
     *              404:
     *                  description: Usuário não encontrado
     *                  schema:
     *                  $ref: #components/schemas/User
     *              200: 
     *                  description: Usuário atualizado
     *                  schema:
     *                  $ref: #components/schemas/User
     *      
     *              500:
     *                  description: Erro interno do servidor
     *                  schema:
     *                  $ref: #components/schemas/User
     *delete:
     *      tags:
     *        -User:
     *         description: Soft delete do usuário
     *          produces:
     *              -application/json
     *          responses:
     *              422:
     *                  description: Todos os campos são obrigatórios
     *                  schema:
     *                      $ref: '#components/schemas/User'
     *              404:
     *                  description: Usuário não encontrado
     *                  schema:
     *                  $ref: #components/schemas/User
     *              200: 
     *                  description: Usuário deletado
     *                  schema:
     *                  $ref: #components/schemas/User
     *      
     *              500:
     *                  description: Erro interno do servidor
     *                  schema:
     *                  $ref: #components/schemas/User
     *post:
     *      tags:
     *        -User:
     *         description: Login de aministradores
     *          produces:
     *              -application/json
     *          responses:
     *              422:
     *                  description: Usuário já cadastrado
     *                  schema:
     *                      $ref: '#components/schemas/User'
     *              201:
     *                  description: Usuário cadastrado com sucesso
     *                  schema:
     *                  $ref: #components/schemas/User
     *              500:
     *                  description: Erro no servidor
     *                  schema:
     *                  $ref: #components/schemas/User
     *get:
     *      tags:
     *        -User:
     *         description: Lista de usuários
     *          produces:
     *              -application/json
     *          responses:
     *              200:
     *                  description: Usuários encontrados
     *                  schema:
     *                      $ref: '#components/schemas/User'
     *              500:
     *                  description: Erro interno
     *                  schema:
     *                  $ref: #components/schemas/User
     */
}



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
