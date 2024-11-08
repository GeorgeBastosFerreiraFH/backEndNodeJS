const express = require('express')
const cors = require('cors')
require('dotenv').config();
const pool = require('./db.js')
const PORT = 3000

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
    const { id_cliente, id_produto } = req.body;
  
    try {
      // Verificar se o cliente existe
      const clienteExiste = await pool.query('SELECT 1 FROM clientes WHERE id = $1', [id_cliente]);
      if (clienteExiste.rowCount === 0) {
        return res.status(400).json({ message: 'Cliente não encontrado' });
      }
  
      // Verificar se o produto existe e obter a quantidade em estoque
      const produtoExiste = await pool.query('SELECT qtde_estoque FROM produtos WHERE id = $1', [id_produto]);
      if (produtoExiste.rowCount === 0) {
        return res.status(400).json({ message: 'Produto não encontrado' });
      }
  
      const estoque = produtoExiste.rows[0].qtde_estoque;
      if (estoque <= 0) {
        return res.status(400).json({ message: 'Produto sem estoque disponível' });
      }
  
      // Inserir a venda
      const consultaVenda = 'INSERT INTO vendas (id_cliente, id_produto) VALUES ($1, $2)';
      await pool.query(consultaVenda, [id_cliente, id_produto]);
  
      // Atualizar o estoque do produto
      const consultaAtualizaEstoque = 'UPDATE produtos SET qtde_estoque = qtde_estoque - 1 WHERE id = $1';
      await pool.query(consultaAtualizaEstoque, [id_produto]);
  
      res.status(201).json({ message: 'Venda cadastrada com sucesso' });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Falha ao cadastrar venda', error: error.message });
    }
  });
  

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
  console.log('API está no AR')
})