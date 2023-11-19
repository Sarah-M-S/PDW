const router = require('express').Router()
const mongoose = require('mongoose');


const Transaction = require('../model/Transaction')
const User = require('../model/User')


// Registrar nova transação
router.post('/transaction', async (req, res) => {
    // req.body
    const { buyerId, sellerId, itemId, date, price } = req.body;

    if (!buyerId || !sellerId || !itemId || !date || !price) {
        res.status(422).json({ error: 'Todos os campos são obrigatórios' });
        return;
    }

    try {
        // Verifica se o buyerId existe na tabela User
        const buyerUser = await User.findById(buyerId);
        if (!buyerUser) {
            return res.status(404).json({ msg: 'Comprador não encontrado' });
        }

        // Verifica se o sellerId existe na tabela User
        const sellerUser = await User.findById(sellerId);
        if (!sellerUser) {
            return res.status(404).json({ msg: 'Vendedor não encontrado' });
        }

        // Cria a transação
        const transaction = new Transaction({
            buyerId: buyerUser._id,
            sellerId: sellerUser._id,
            itemId,
            date,
            price
        });

        // Salva a transação no banco de dados
        const createdTransaction = await Transaction.create(transaction);

        // Adiciona o ID da transação aos usuários envolvidos
        if (!buyerUser.transactions) {
            buyerUser.transactions = [];
        }
        buyerUser.transactions.push(createdTransaction._id);

        if (!sellerUser.transactions) {
            sellerUser.transactions = [];
        }
        sellerUser.transactions.push(createdTransaction._id);

        // Salva as alterações nos usuários
        await buyerUser.save();
        await sellerUser.save();

        res.status(201).json({ message: 'Transação criada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router