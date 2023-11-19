//importando modulos
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const app = express();



//leitura de JSON
app.use(
    express.urlencoded({
        extended:true
    })
);

app.use(express.json());


//rotas da API
const userRouter = require('./routes/userRoutes')
const bookRouter = require('./routes/bookRoutes')
const transactionRouter = require('./routes/transactionRoutes')
const categoryRouter = require('./routes/categoryRoutes')

app.use('/user', userRouter)
app.use('/book', bookRouter)
app.use('/transaction', transactionRouter)
app.use('/category', categoryRouter)

//rota inicial/endpoint
app.get('/',  (req, res) => {

    //mostrar a requisição


    res.json({message: 'Oi express'})
})

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

//porta do express
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@apidb.kmscw2k.mongodb.net/?retryWrites=true&w=majority`).then(() => {
        console.log("Conectamos ao MongoDB com sucesso")
        app.listen(3000)
    }).catch((err) => console.log(err))