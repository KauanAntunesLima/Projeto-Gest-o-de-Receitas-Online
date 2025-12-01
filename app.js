/****************************************************************************************
 * Objetivo: Arquivo responsável PELA CRIAÇÃO DE ENDPOINTS
 * Data: 01/12/2025
 * Autor: Gabriel Cavalcante dos Santos
 * Versão: 2.0
 ****************************************************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()
const app = express()

const PORT = process.PORT || 8080

app.use((request, response, next) => {
    response.header('Acess-Control-Allow_Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())
    next()
})

const controllerReceita = require('./controller/controller_receita.js')

/***********************
 * EndPoints tbl_receita
 * **********************/

//Ambiente de GET
app.get('/v1/toqueGourmet/receita', cors(), async function (req, res) {

    let receita = await controllerReceita.listarReceita()
    res.status(receita.status_code)
    res.json(receita)
})

app.get('v1/toqueGourmet/receita/:id', cors(), async function (req,res) {

    let idReceita = req.params.id
    let receita = await controllerReceita.pegarId(idReceita)
    res.status(receita.status_code)
    res.json(receita)
})

//Ambiente POST
app.post ('v1/toqueGourmet/receita', cors(), bodyParserJSON, async function (req, res) {

    let dadosBody = req.bodylet
    let contentType = req.headers['content-type']
    let receita = await controllerReceita.inserirReceita(dadosBody, contentType)
    res.status(receita.status_code)
    res.json(receita)
    
})

//ambiente PUT

app.put('/v1/locadora/receita/id', cors(), bodyParserJSON, async function (req, res) {

    let dadosBody = req.body
    let idReceita = req.params.id
    let contentType = req.headers['content-type']

    let receita = await controllerReceita.atualizarReceita(dadosBody, idReceita, contentType)
    res.status(receita.status_code)
    res.json(receita)
})

/****************************************************************** */
//ultima linha do codigo 
app.listen(PORT, function () {
    console.log('API aguardando requisição')
})
