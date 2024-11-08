const express = require('express')
const cors = require('cors')
require('dotenv').config();
const pool = require('./db.js')
const PORT = process.env.PORT || 3000;

const app = express()

app.use(cors())
app.use(express.json())

// CLIENTES 

app.get('/clientes', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM clientes')
    res.json(rows)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Falha ao conectar no banco', error: error.message })
  }
})

app.get('/clientes/:id', async (req, res) => {
  const { id } = req.params

  try {
    const { rows } = await pool.query('SELECT * FROM clientes WHERE id = $1', [
      id,
    ])
    res.json(rows)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Falha ao conectar no banco', error: error.message })
  }
})

app.post('/clientes', async (req, res) => {
  const { nome, cpf, telefone } = req.body

  try {
    const consulta =
      'INSERT INTO clientes (nome, cpf, telefone) VALUES ($1, $2, $3)'

    await pool.query(consulta, [nome, cpf, telefone])

    res.status(201).json({ message: 'Usuário cadastrado com sucesso' })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Falha ao cadastrar usuário', error: error.message })
  }
})

app.put('/clientes/:id', async (req, res) => {
  const { id } = req.params
  const { nome, cpf, telefone } = req.body

  try {
    const consulta =
      'UPDATE clientes SET nome = $1, cpf = $2, telefone = $3 WHERE id = $4'

    await pool.query(consulta, [nome, cpf, telefone, id])
    res.status(200).json({ message: 'Usuário atualizado com sucesso' })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Falha ao atualizar usuário', error: error.message })
  }
})

app.delete('/clientes/:id', async (req, res) => {
  const { id } = req.params

  try {
    const consulta = 'DELETE FROM clientes WHERE id = $1'

    await pool.query(consulta, [id])
    res.status(200).json({ message: 'Usuário deletado com sucesso' })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Falha ao deletar usuário', error: error.message })
  }
})

// PRODUTOS

app.get('/produtos', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM produtos')
      res.json(rows)
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Falha ao conectar no banco', error: error.message })
    }
  })
  
  app.post('/produtos', async (req, res) => {
    const { nome, preco, qtde_estoque } = req.body
  
    try {
      const consulta =
        'INSERT INTO produtos (nome, preco, qtde_estoque) VALUES ($1, $2, $3)'
  
      await pool.query(consulta, [nome, preco, qtde_estoque])
  
      res.status(201).json({ message: 'Produto cadastrado com sucesso' })
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Falha ao cadastrar produto', error: error.message })
    }
  })

  app.get('/produtos/:id', async (req, res) => {
    const { id } = req.params

    try {
      const { rows } = await pool.query('SELECT * FROM produtos WHERE id = $1', [
        id,
      ])
      res.json(rows)
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Falha ao conectar no banco', error: error.message })
    }
  })
  
  app.put('/produtos/:id', async (req, res) => {
    const { id } = req.params
    const { nome, preco, qtde_estoque } = req.body
  
    try {
      const consulta =
        'UPDATE produtos SET nome = $1, preco = $2, qtde_estoque = $3 WHERE id = $4'
  
      await pool.query(consulta, [nome, preco, qtde_estoque, id])
      res.status(200).json({ message: 'Produto atualizado com sucesso' })
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Falha ao atualizar produto', error: error.message })
    }
  })
  
  app.delete('/produtos/:id', async (req, res) => {
    const { id } = req.params
  
    try {
      const consulta = 'DELETE FROM produtos WHERE id = $1'
  
      await pool.query(consulta, [id])
      res.status(200).json({ message: 'Produto deletado com sucesso' })
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Falha ao deletar produto', error: error.message })
    }
  })

  // Vendas

  app.post('/vendas', async (req, res) => {
    const { id_cliente, id_produto } = req.body

    try {
        const consulta = 'INSERT INTO vendas (id_cliente, id_produto) VALUES ($1, $2)';
        await pool.query(consulta, [id_cliente, id_produto]);
        console.log("teste");
        

      res.status(201).json({ message: 'Venda cadastrada com sucesso' })
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Falha ao cadastrar venda', error: error.message })
    }
  })

  app.get('/vendas', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM vendas')
      res.json(rows)
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Falha ao conectar no banco', error: error.message })
    }
  })

  app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
  });
