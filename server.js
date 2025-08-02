const express = require('express')
const fs = require('fs')
const path = require('path')
const config = require('./config')
const app = express()

app.use((req, res, next) => {
  const origin = req.headers.origin

  if (config.allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
    next()
  } else {
    res.status(403).send('Acesso negado: domínio não autorizado')
  }
})

app.get('/arquivo/:nome', (req, res) => {
  const nomeArquivo = req.params.nome
  const caminhoArquivo = path.join(__dirname, config.protectedFolder, nomeArquivo)

  if (fs.existsSync(caminhoArquivo)) {
    res.sendFile(caminhoArquivo)
  } else {
    res.status(404).send('Arquivo não encontrado')
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`API protegida rodando em http://localhost:${PORT}`)
})