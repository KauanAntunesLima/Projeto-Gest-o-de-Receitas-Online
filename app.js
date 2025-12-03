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
const controllerAlergenos = require('./controller/controller_alergenos.js')

/***********************
 * EndPoints tbl_receita
 * **********************/

//Ambiente de GET
app.get('/v1/toque_gourmet/receita', cors(), async function (req, res) {

    let receita = await controllerReceita.listarReceita()
    res.status(receita.status_code)
    res.json(receita)
})

app.get('/v1/toque_gourmet/receita/:id', cors(), async function (req,res) {

    let idReceita = req.params.id
    let receita = await controllerReceita.pegarIdReceita(idReceita)
    res.status(receita.status_code)
    res.json(receita)
})

//Ambiente POST
app.post ('/v1/toque_gourmet/receita', cors(), bodyParserJSON, async function (req, res) {

    let dadosBody = req.body
    let contentType = req.headers['content-type']
    console.log(req.body)
    let receita = await controllerReceita.inserirReceita(dadosBody, contentType)
    res.status(receita.status_code)
    res.json(receita)
    
})

//ambiente PUT

app.put('/v1/toque_gourmet/receita/:id', cors(), bodyParserJSON, async function (req, res) {

    let dadosBody = req.body
    let idReceita = req.params.id
    let contentType = req.headers['content-type']

    let receita = await controllerReceita.atualizarReceita(dadosBody, idReceita, contentType)
    res.status(receita.status_code)
    res.json(receita)
})

// ambiente delete

app.delete('/v1/toque_gourmet/receita/:id', cors(), async function(request, response){

    let idReceita = request.params.id
    let receita = await controllerReceita.deletarReceita(idReceita)
    response.status(receita.status_code)
    response.json(receita)
})


/***********************
 * EndPoints tbl_alergenos
 * **********************/

//ambiente get

 app.get('/v1/toque_gourmet/alergenos', cors(), async function(req, res){

    let alergenos = await controllerAlergenos.listarAlergenos() 
    res.status(alergenos.status_code)
    res.json(alergenos)
}) 

app.get('/v1/toque_gourmet/alergenos/:id', cors(), async function (request, response) {

    let idAlergenos = request.params.id
    let alergenos = await controllerAlergenos.pegarIdAlergenos(idAlergenos)
    response.status(alergenos.status_code)
    response.json(alergenos)
    
})

//ambiente POST

app.post ('/v1/toque_gourmet/alergenos', cors(), bodyParserJSON, async function (req, res) {

    let dadosBody = req.body
    let contentType = req.headers['content-type']
  
    let alergeno = await controllerAlergenos.inserirAlergenos(dadosBody, contentType)
    res.status(alergeno.status_code)
    res.json(alergeno)
    
})


/****************************************************************** */


//ultima linha do codigo 
app.listen(PORT, function () {
    console.log('API aguardando requisição')
})
