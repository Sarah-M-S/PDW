const router = require('express').Router()
const mongoose = require('mongoose');


const Category = require('../model/Category')

//adicionar nova categoria
router.post('/categories', async(req, res) => {

    //req.body
    const {categoryName, categoryDescription, status} = req.body

    if(!categoryName || !categoryDescription || !status){
        res.status(422).json({error: 'Todos os campos são obrigatórios'})
    }


    let category = new Category({
        categoryName,
        categoryDescription,
        status
    })


    try{
        await Category.create(category)
        
        res.status(201).json({message:'Categoria criada com sucesso'})

    }catch(error){
        res.status(500).json({error: error})
    }

})

//listar categorias

router.get('/categories', async (req, res) => {
    try {
      const category = await Category.find()
  
      res.status(200).json(category)
    } catch (error) {
      res.status(500).json({ erro: error })
    }
  })

//editar categoria

router.put('/categories/:id', async (req, res) => {

    const id = req.params.id;
    const {categoryName, categoryDescription, status} = req.body;

    const category = {
        categoryName,
        categoryDescription,
        status
    }
    try{

        const updatedCategory = await Category.updateOne({_id: id}, category)
        if (updatedCategory.matchedCount === 0) {
            return res.status(404).json({ msg: "Categoria não encontrada!" });
        }

        res.status(200).json({msg: "Categoria editada com sucesso"});

    }catch(err){
        res.status(500).json({err:err})
    }

})

router.delete('/categories/:id', async (req, res) => {

    const id = req.params.id;
    const {status} = req.body;

    const category = { status }

    if(!category){
        res.status(422).json({error: 'Todos os campos são obrigatórios'})
    }

    try{

        const updatedCategory = await Category.updateOne({_id: id}, category)
        if (updatedCategory.matchedCount === 0) {
            return res.status(404).json({ msg: "Categoria não encontrada!" });
        }

        res.status(200).json({msg: "Categoria deletada com sucesso"});

    }catch(err){
        res.status(500).json({err:err})
    }

    

})




module.exports = router