/****************************************************************************************
 * Objetivo: Arquivo responsável PELA CRIAÇÃO DE ENDPOINTS
 * Data: 01/12/2025
 * Autor: Gabriel Cavalcante dos Santos
 * Versão: 2.0
 ****************************************************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer')

const bodyParserJSON = bodyParser.json()
const app = express()

// Configuração do Multer para upload de arquivos
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB em bytes
    }
})

// Import do controller de upload para Azure
const controllerUploadAzure = require('./upload/controller_upload_azure.js')

const PORT = process.PORT || 8080

app.use((request, response, next) => {
    response.header('Acess-Control-Allow_Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())
    next()
})

const controllerReceita = require('./controller/controller_receita.js')
const controllerAlergenos = require('./controller/controller_alergenos.js')
const controllerIngredientes = require('./controller/controller_ingredientes.js')
const controllerCategoria = require('./controller/controller_categoria.js')
const controllerCozinha = require('./controller/controller_cozinha.js')
const controllerModoPreparo = require('./controller/controller_modo_preparo.js')
const controllerUsuario = require('./controller/controller_usuario.js')

/***********************
 * EndPoints tbl_receita
 * **********************/

//Ambiente de GET
app.get('/v1/toque_gourmet/receita', cors(), async function (req, res) {

    let receita = await controllerReceita.listarReceita()
    res.status(receita.status_code)
    res.json(receita)
})

app.get('/v1/toque_gourmet/receita/:id', cors(), async function (req, res) {

    let idReceita = req.params.id
    let receita = await controllerReceita.pegarIdReceita(idReceita)
    res.status(receita.status_code)
    res.json(receita)
})

//Ambiente POST (sem imagem)
app.post('/v1/toque_gourmet/receita', cors(), bodyParserJSON, async function (req, res) {

    let dadosBody = req.body
    let contentType = req.headers['content-type']

    let receita = await controllerReceita.inserirReceita(dadosBody, contentType)
    res.status(receita.status_code)
    res.json(receita)

})

//Ambiente POST com upload de imagem para Azure
app.post('/v1/toque_gourmet/receita/upload', cors(), upload.single('imagem'), async function (req, res) {

    try {
        // Verifica se foi enviado um arquivo
        if (!req.file) {
            return res.status(400).json({
                status: false,
                status_code: 400,
                message: 'É necessário enviar uma imagem',
                error: 'Nenhum arquivo enviado'
            })
        }

        // Faz upload para Azure
        let urlImagem = await controllerUploadAzure.uploadFiles(req.file)

        if (!urlImagem) {
            return res.status(400).json({
                status: false,
                status_code: 400,
                message: 'Erro ao fazer upload da imagem',
                error: 'Falha no upload para Azure'
            })
        }

        console.log('Imagem enviada para:', urlImagem)

        // Adiciona a URL da imagem aos dados da receita
        let dadosBody = JSON.parse(req.body.dados)
        dadosBody.imagem = urlImagem

        // Insere a receita no banco com a URL da imagem
        let contentType = 'application/json'
        let receita = await controllerReceita.inserirReceita(dadosBody, contentType)

        res.status(receita.status_code)
        res.json(receita)

    } catch (error) {
        console.error('Erro no insert com upload:', error)
        res.status(500).json({
            status: false,
            status_code: 500,
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
})

//ambiente PUT (sem imagem)

app.put('/v1/toque_gourmet/receita/:id', cors(), bodyParserJSON, async function (req, res) {

    let dadosBody = req.body
    let idReceita = req.params.id
    let contentType = req.headers['content-type']

    let receita = await controllerReceita.atualizarReceita(dadosBody, idReceita, contentType)
    res.status(receita.status_code)
    res.json(receita)
})

//ambiente PUT com upload de imagem para Azure
app.put('/v1/toque_gourmet/receita/upload/:id', cors(), upload.single('imagem'), async function (req, res) {

    try {
        // Verifica se foi enviado um arquivo
        if (!req.file) {
            return res.status(400).json({
                status: false,
                status_code: 400,
                message: 'É necessário enviar uma imagem',
                error: 'Nenhum arquivo enviado'
            })
        }

        // Faz upload para Azure
        let urlImagem = await controllerUploadAzure.uploadFiles(req.file)

        if (!urlImagem) {
            return res.status(400).json({
                status: false,
                status_code: 400,
                message: 'Erro ao fazer upload da imagem',
                error: 'Falha no upload para Azure'
            })
        }

        console.log('Imagem atualizada para:', urlImagem)

        // Adiciona a URL da imagem aos dados da receita
        let dadosReceita = JSON.parse(req.body.dados)
        dadosReceita.imagem = urlImagem
        dadosReceita.id_receita = req.params.id

        // Atualiza a receita no banco com a nova URL da imagem
        let contentType = 'application/json'
        let receita = await controllerReceita.atualizarReceita(dadosReceita, req.params.id, contentType)

        res.status(receita.status_code)
        res.json(receita)

    } catch (error) {
        console.error('Erro no update com upload:', error)
        res.status(500).json({
            status: false,
            status_code: 500,
            message: 'Erro interno do servidor',
            error: error.message
        })
    }
})


//Buscar receitas por nome
app.get('/v1/toque_gourmet/receita/nome/:nome', cors(), async function (request, response) {

    let nome = request.params.nome
    let receita = await controllerReceita.buscarReceitaPorNome(nome)
    response.status(receita.status_code)
    response.json(receita)
})

//Listar receitas por usuário
app.get('/v1/toque_gourmet/receita/usuario/:idUsuario', cors(), async function (request, response) {

    let id = request.params.idUsuario
    let receitas = await controllerReceita.listarReceitasPorUsuario(id)
    response.status(receitas.status_code)
    response.json(receitas)
})

//Filtrar receitas com múltiplos parâmetros
app.post('/v1/toque_gourmet/receita/filtro', cors(), bodyParserJSON, async function (request, response) {

    let filtros = request.body

    let receitas = await controllerReceita.filtrarReceitas(filtros)

    response.status(receitas.status_code)
    response.json(receitas)
})

// ambiente delete

app.delete('/v1/toque_gourmet/receita/:id', cors(), async function (request, response) {

    let idReceita = request.params.id
    let receita = await controllerReceita.deletarReceita(idReceita)
    response.status(receita.status_code)
    response.json(receita)
})

/***********************
 * EndPoints tbl_alergenos
 * **********************/

//ambiente get

app.get('/v1/toque_gourmet/alergenos', cors(), async function (req, res) {

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

app.post('/v1/toque_gourmet/alergenos', cors(), bodyParserJSON, async function (req, res) {

    let dadosBody = req.body
    let contentType = req.headers['content-type']

    let alergeno = await controllerAlergenos.inserirAlergenos(dadosBody, contentType)
    res.status(alergeno.status_code)
    res.json(alergeno)

})

//ambiente PUT

app.put('/v1/toque_gourmet/alergenos/:id', cors(), bodyParserJSON, async function (request, response) {

    let dadosBody = request.body
    let idAlergeno = request.params.id
    let contentType = request.headers['content-type']

    let alergenos = await controllerAlergenos.atualizarAlergenos(dadosBody, idAlergeno, contentType)
    response.status(alergenos.status_code)
    response.json(alergenos)
})

//ambiente delete

app.delete('/v1/toque_gourmet/alergenos/:id', cors(), async function (request, response) {

    let idAlergeno = request.params.id
    let alergeno = await controllerAlergenos.deletarAlergenos(idAlergeno)
    response.status(alergeno.status_code)
    response.json(alergeno)
})

/****************************************************************** */

/***********************
 * EndPoints tbl_alergenos
 * **********************/

//ambiente GET

app.get('/v1/toque_gourmet/ingredientes', cors(), async function (req, res) {

    let ingrediente = await controllerIngredientes.listarIngredientes()
    res.status(ingrediente.status_code)
    res.json(ingrediente)
})

app.get('/v1/toque_gourmet/ingredientes/:id', cors(), async function (request, response) {

    let idIngrediente = request.params.id
    let ingrediente = await controllerIngredientes.pegarIdIngrediente(idIngrediente)
    response.status(ingrediente.status_code)
    response.json(ingrediente)

})

//ambiente post

app.post('/v1/toque_gourmet/ingredientes', cors(), bodyParserJSON, async function (req, res) {

    let dadosBody = req.body
    let contentType = req.headers['content-type']

    let ingrediente = await controllerIngredientes.inserirIngrediente(dadosBody, contentType)
    res.status(ingrediente.status_code)
    res.json(ingrediente)

})

//ambiente PUT

app.put('/v1/toque_gourmet/ingredientes/:id', cors(), bodyParserJSON, async function (request, response) {

    let dadosBody = request.body
    let idIngrediente = request.params.id
    let contentType = request.headers['content-type']

    let ingredientes = await controllerIngredientes.atualizarIngredientes(dadosBody, idIngrediente, contentType)
    response.status(ingredientes.status_code)
    response.json(ingredientes)
})

//ambiente delete

app.delete('/v1/toque_gourmet/ingredientes/:id', cors(), async function (request, response) {

    let idIngrediente = request.params.id
    let ingrediente = await controllerIngredientes.deletarIngrediente(idIngrediente)
    response.status(ingrediente.status_code)
    response.json(ingrediente)
})

/***********************
 * EndPoints tbl_categoria
 * **********************/

//ambiente GET

app.get('/v1/toque_gourmet/categoria', cors(), async function (req, res) {

    let categoria = await controllerCategoria.listarCategoria()
    res.status(categoria.status_code)
    res.json(categoria)
})

app.get('/v1/toque_gourmet/categoria/:id', cors(), async function (request, response) {

    let idCategoria = request.params.id
    let categoria = await controllerCategoria.pegarIdCategoria(idCategoria)
    response.status(categoria.status_code)
    response.json(categoria)

})

//ambiente POST

app.post('/v1/toque_gourmet/categoria', cors(), bodyParserJSON, async function (req, res) {

    let dadosBody = req.body
    let contentType = req.headers['content-type']

    let categoria = await controllerCategoria.inserirCategoria(dadosBody, contentType)
    res.status(categoria.status_code)
    res.json(categoria)

})

//Ambiente PUT

app.put('/v1/toque_gourmet/categoria/:id', cors(), bodyParserJSON, async function (req, res) {

    let dadosBody = req.body
    let idCategoria = req.params.id
    let contentType = req.headers['content-type']

    let categoria = await controllerCategoria.atualizarCategoria(dadosBody, idCategoria, contentType)

    res.status(categoria.status_code)
    res.json(categoria)
})

// ambiente delete

app.delete('/v1/toque_gourmet/categoria/:id', cors(), async function (request, response) {

    let idCategoria = request.params.id
    let categoria = await controllerCategoria.deletarCategoria(idCategoria)
    response.status(categoria.status_code)
    response.json(categoria)
})

/***********************
 * EndPoints tbl_cozinha
 * **********************/

//Ambiente de GET
app.get('/v1/toque_gourmet/cozinha', cors(), async function (req, res) {

    let cozinha = await controllerCozinha.listarCozinha()
    res.status(cozinha.status_code)
    res.json(cozinha)
})

app.get('/v1/toque_gourmet/cozinha/:id', cors(), async function (req, res) {

    let idCozinha = req.params.id
    let cozinha = await controllerCozinha.pegarIdCozinha(idCozinha)
    res.status(cozinha.status_code)
    res.json(cozinha)
})

//Ambiente POST
app.post('/v1/toque_gourmet/cozinha', cors(), bodyParserJSON, async function (req, res) {

    let dadosBody = req.body
    let contentType = req.headers['content-type']
    let cozinha = await controllerCozinha.inserirCozinha(dadosBody, contentType)
    res.status(cozinha.status_code)
    res.json(cozinha)

})

//ambiente PUT

app.put('/v1/toque_gourmet/cozinha/:id', cors(), bodyParserJSON, async function (req, res) {

    let dadosBody = req.body
    let idCozinha = req.params.id
    let contentType = req.headers['content-type']

    let cozinha = await controllerCozinha.atualizarCozinha(dadosBody, idCozinha, contentType)
    console.log(cozinha)
    res.status(cozinha.status_code)
    res.json(cozinha)
})

// ambiente delete

app.delete('/v1/toque_gourmet/cozinha/:id', cors(), async function (request, response) {

    let idCozinha = request.params.id
    let cozinha = await controllerCozinha.deletarCozinha(idCozinha)
    response.status(cozinha.status_code)
    response.json(cozinha)
})

/***********************
 * EndPoints tbl_modo_preparo
 * **********************/

//Ambiente GET

app.get('/v1/toque_gourmet/modo_preparo', cors(), async function (req, res) {

    let cozinha = await controllerModoPreparo.listarModoPreparo()
    res.status(cozinha.status_code)
    res.json(cozinha)
})

app.get('/v1/toque_gourmet/modo_preparo/:id', cors(), async function (req, res) {

    let idModoPreparo = req.params.id
    let modoPreparo = await controllerModoPreparo.pegarIdModoPreparo(idModoPreparo)
    res.status(modoPreparo.status_code)
    res.json(modoPreparo)
})

//Ambiente Post

app.post('/v1/toque_gourmet/modo_preparo', cors(), bodyParserJSON, async function (req, res) {

    let dadosBody = req.body
    let contentType = req.headers['content-type']
    let modoPreparo = await controllerModoPreparo.inserirModoPreparo(dadosBody, contentType)
    res.status(modoPreparo.status_code)
    res.json(modoPreparo)

})

//Ambiente PUT

app.put('/v1/toque_gourmet/modo_preparo/:id', cors(), bodyParserJSON, async function (req, res) {

    let dadosBody = req.body
    let idModoPreparo = req.params.id
    let contentType = req.headers['content-type']

    let modoPreparo = await controllerModoPreparo.atualizarModoPreparo(dadosBody, idModoPreparo, contentType)
    console.log(modoPreparo)
    res.status(modoPreparo.status_code)
    res.json(modoPreparo)
})

//Ambiente DELETE

app.delete('/v1/toque_gourmet/modo_preparo/:id', cors(), async function (request, response) {

    let idModoPreparo = request.params.id_modo_preparo
    let modoPreparo = await controllerModoPreparo.deletarModoPreparo(idModoPreparo)
    response.status(modoPreparo.status_code)
    response.json(modoPreparo)
})

/***********************
 * EndPoints tbl_usuario
 * **********************/


//Ambiente get

app.get('/v1/toque_gourmet/usuario', cors(), async function (req, res) {

    let usuario = await controllerUsuario.listarUsuario()
    res.status(usuario.status_code)
    res.json(usuario)
})

app.get('/v1/toque_gourmet/usuario/:id', cors(), async function (req, res) {

    let idUsuario = req.params.id
    let usuario = await controllerUsuario.pegarIdUsuario(idUsuario)
    res.status(usuario.status_code)
    res.json(usuario)
})

//Ambiente POST

app.post('/v1/toque_gourmet/usuario', cors(), bodyParserJSON, async function (req, res) {

    let dadosBody = req.body
    let contentType = req.headers['content-type']
    let usuario = await controllerUsuario.inserirUsuario(dadosBody, contentType)
    res.status(usuario.status_code)
    res.json(usuario)

})

//Ambiente PUT

app.put('/v1/toque_gourmet/usuario/:id', cors(), bodyParserJSON, async function (req, res) {

    let dadosBody = req.body
    let idUsuario = req.params.id
    let contentType = req.headers['content-type']

    let usuario = await controllerUsuario.atualizarUsuario(dadosBody, idUsuario, contentType)
    console.log(usuario)
    res.status(usuario.status_code)
    res.json(usuario)
})

//Ambiente DELETE

app.delete('/v1/toque_gourmet/usuario/:id', cors(), async function (request, response) {

    let idUsuario = request.params.id
    let usuario = await controllerUsuario.deletarUsuario(idUsuario)
    response.status(usuario.status_code)
    response.json(usuario)
})

//Ambiente de Logindo Usuario

app.post ('/v1/toque_gourmet/usuario/login', cors(), bodyParserJSON, async function (req, res) {

    let dadosBody = req.body
    console.log(dadosBody)
    let usuario = await controllerUsuario.loginUsuario(dadosBody)
    res.status(usuario.status_code)
    res.json(usuario)
})

//ultima linha do codigo 
app.listen(PORT, function () {
    console.log('API aguardando requisição')
})
