const router = require('express').Router()
const mongoose = require('mongoose');

const Book = require('../model/Books')

module.exports = router =>{
    /**
     * @swagger
     * /book
     *  post:
     *      tags:
     *        - Book
     *         description: Registrar novos itens
     *         produces: 
     *          -application/json
     *      responses:
     *          422:
     *              description: Todos os campos são obrigatórios
     *              schema:
     *                 $ref: '#/components/schemas/Book'
     * get:
     *      tags:
     *        -Book:
     *         description: Listar todos os itens
     *          produces:
     *              -application/json
     *          responses:
     *              200:
     *                  description: Lista todos os itens
     *                  schema:
     *                      $ref: '#components/schemas/Book'
     *              500:
     *                  description: Erro interno do servidor
     *                  schema:
     *                  $ref: #components/schemas/Book
     * get:
     *      tags:
     *        -Book:
     *         description: Listar item específico
     *          produces:
     *              -application/json
     *          responses:
     *              422:
     *                  description: Item não encontrado
     *                  schema:
     *                      $ref: '#components/schemas/Book'
     *              200:
     *                  description: Item encontrado
     *                  schema:
     *                  $ref: #components/schemas/Book
     *              500:
     *                  description: Erro interno do servidor
     *                  schema:
     *                  $ref: #components/schemas/Book
     * put:
     *      tags:
     *        -Book:
     *         description: Editar item
     *          produces:
     *              -application/json
     *          responses:
     *              422:
     *                  description: Todos os campos são obrigatórios
     *                  schema:
     *                      $ref: '#components/schemas/Book'
     *              404:
     *                  description: Item não encontrado
     *                  schema:
     *                  $ref: #components/schemas/Book
     *              200: 
     *                  description: Item editado
     *                  schema:
     *                  $ref: #components/schemas/Book
     *      
     *              500:
     *                  description: Erro interno do servidor
     *                  schema:
     *                  $ref: #components/schemas/Book
     *delete:
     *      tags:
     *        -Book:
     *         description: Soft delete no item
     *          produces:
     *              -application/json
     *          responses:
     *              422:
     *                  description: Todos os campos são obrigatórios
     *                  schema:
     *                      $ref: '#components/schemas/Book'
     *              404:
     *                  description: Item não encontrado
     *                  schema:
     *                  $ref: #components/schemas/Book
     *              200: 
     *                  description: Item deletado
     *                  schema:
     *                  $ref: #components/schemas/Book
     *      
     *              500:
     *                  description: Erro interno do servidor
     *                  schema:
     *                  $ref: #components/schemas/Book
     */
}



//cadastrar itens
router.post('/items', async(req, res) => {

    //req.body
    const {title, author, category, price, sinopse, status, date, edition, idSalesPerson} = req.body

    if(!title || !author || !category || !price || !sinopse || !date || !edition || !idSalesPerson || !status){
        res.status(422).json({error: 'Todos os campos são obrigatórios'})
    }


    let item = new Book({
        title,
        author,
        category,
        price,
        sinopse,
        date,
        edition,
        idSalesPerson,
        status
    })


    try{
        await Book.create(item)
        
        res.status(201).json({message:'Item criado com sucesso'})

    }catch(error){
        res.status(500).json({error: error})
    }

})


//listar itens
router.get('/items', async (req, res) => {
    try {
      const items = await Book.find()
  
      res.status(200).json(items)
    } catch (error) {
      res.status(500).json({ erro: error })
    }
  })

//listar item específico

router.get('/items/:id', async (req, res) => {
    const id = req.params.id
  
    try {
      const items = await Book.findOne({ _id: id })
  
      if (!items) {
        res.status(422).json({ message: 'Item não encontrado!' })
        return
      }
  
      res.status(200).json(items)
    } catch (error) {
      res.status(500).json({ erro: error })
    }
  })


//editar informações de item

router.put('/items/:id', async (req, res) => {

    const id = req.params.id;
    const {title, author, category, price, sinopse, date, edition, idSalesPerson, status} = req.body;

    const item = {
        title,
        author,
        category,
        price,
        sinopse,
        date,
        edition,
        idSalesPerson,
        status
    }

    if(!title || !author || !category || !price || !sinopse || !date || !edition || !idSalesPerson || !status){
        res.status(422).json({error: 'Todos os campos são obrigatórios'})
    }


    try{

        const updatedItem = await Book.updateOne({_id: id}, item)
        if (updatedItem.matchedCount === 0) {
            return res.status(404).json({ msg: "Item não encontrado!" });
        }

        res.status(200).json(item);

    }catch(err){
        res.status(500).json({err:err})
    }

})

router.delete('/items/:id', async (req, res) => {

    const id = req.params.id;
    const {status} = req.body;

    const item = { status }

    if(!item){
        res.status(422).json({error: 'Todos os campos são obrigatórios'})
    }

    try{

        const updatedItem = await Book.updateOne({_id: id}, item)
        if (updatedItem.matchedCount === 0) {
            return res.status(404).json({ msg: "Item não encontrado!" });
        }

        res.status(200).json({msg: "Item deletado com sucesso"});

    }catch(err){
        res.status(500).json({err:err})
    }

    

})


module.exports = router