/****************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entreo App e a Model 
 *           (validações, tratamento de dados, tratamento de errros, etc)
 * Data: 01/12/2025
 * Autor: Gabriel Cavalcante
 * Versão: 2.0
 ****************************************************************************************/
const receitaDAO = require('../model/DAO/receita.js')
const controllerReceitaCozinha = require('./controller_receita_cozinha.js')
const controllerCozinha = require('./controller_cozinha.js')
const controllerReceitaIngrediente = require('./controller_receita_ingredientes.js')
const controllerIngrediente = require('./controller_ingredientes.js')

const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

const listarReceita = async function () {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let result = await receitaDAO.getSelectAllreceita()
        
        if (result && result.length > 0) {

            for (let receita of result) {
                
                let cozinhaId = await controllerReceitaCozinha.buscarCozinhaReceitaId(receita.id_receita)
                if (cozinhaId?.response?.receitaCozinha?.length > 0) { 
                    let cozinha = await controllerCozinha.pegarIdCozinha(cozinhaId.response.receitaCozinha[0].id_cozinha)
                    receita.cozinha = cozinha
                }

                let data = await controllerReceitaIngrediente.pegarReceitaIngredientePorIdReceita(receita.id_receita)

                receita.ingrediente = [] 

                if (data && data.response && data.response.receita_ingredientes) {

                    for (let id of data.response.receita_ingredientes) { 

                        let ingredienteAchado = await controllerIngrediente.pegarIdIngrediente(id.id_ingredientes)
                        

                        if (ingredienteAchado && ingredienteAchado.response && ingredienteAchado.response.ingrediente) {

                            for (let ingrediente of ingredienteAchado.response.ingrediente) {
                                let novoIngrediente = {
                                    id_ingrediente: ingrediente.id_ingredientes,
                                    nome: ingrediente.nome,
                                    tipo: ingrediente.tipo,
                                    quantidade: id.quantidade,
                                    unidade: id.unidade
                                }

                                receita.ingrediente.push(novoIngrediente)
                            }
                        } 

                    }
                } 

            } 

            MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
            MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
            MESSAGE.HEADER.response.receita = result
            
            return MESSAGE.HEADER

        } else {
            return MESSAGE.ERROR_NOT_FOUND
        }

    } catch (error) {
        console.error(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const pegarIdReceita = async function (id) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validaçaõ de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            //Chama a função para filtrar pelo ID
            let result = await receitaDAO.getSelectByIdReceita(parseInt(id))

            if (result) {
                if (result.length > 0) {

                    let cozinhaId = await controllerReceitaCozinha.buscarCozinhaReceitaId(id)
                    if (cozinhaId) {
                        let cozinha = await controllerCozinha.pegarIdCozinha(cozinhaId.response.receitaCozinha[0].id_cozinha)
                        if (cozinha) {
                            result[0].cozinha = cozinha.response.cozinha

                            let infoIngredienteDaReceita = await controllerReceitaIngrediente.pegarReceitaIngredientePorIdReceita(id)
                            if (infoIngredienteDaReceita) {

                                result[0].ingrediente = []

                                for (id of infoIngredienteDaReceita.response.receita_ingredientes) {

                                    let ingredienteAchado = await controllerIngrediente.pegarIdIngrediente(id.id_ingredientes)
                                    if (ingredienteAchado) {

                                        for (let ingrediente of ingredienteAchado.response.ingrediente) {

                                            let novoIngrediente = {
                                                id_ingrediente: ingrediente.id_ingredientes,
                                                nome: ingrediente.nome,
                                                tipo: ingrediente.tipo,
                                                quantidade: id.quantidade,
                                                unidade: id.unidade
                                            }

                                            result[0].ingrediente.push(novoIngrediente)
                                        }
                                    } else {
                                        return ingredienteAchado
                                    }
                                }
                                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                                MESSAGE.HEADER.response.receita = result

                                return MESSAGE.HEADER //200
                            } else {
                                return data
                            }
                        } else {
                            return cozinha
                        }
                    } else {
                        return cozinhaId
                    }
                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }

            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido' //400
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500

    }
}

const atualizarReceita = async function (receita, id, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //validção do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosReceita(receita)

            if (!validarDados) {

                //chama a função para validar a consistencia do id e verificar se existe no banco de dados
                let validarId = await pegarIdReceita(id)


                //verifica se o id existe no BD, caso exista teremos o status 200
                if (validarId.status_code == 200) {

                    receita.id_receita = parseInt(id)

                    //Chama a função do DAO para atualizar um novo filme
                    let result = await receitaDAO.setUpdateReceita(receita)

                    if (result) {


                        MESSAGE.HEADER.status = MESSAGE.SUCCES_UPDATE_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCES_UPDATE_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCES_UPDATE_ITEM.message
                        MESSAGE.HEADER.response = receita

                        return MESSAGE.HEADER
                    } else {

                        return MESSAGE.ERROR_INERNAL_SERVER_MODEL//500
                    }
                } else {

                    return validarId // retorno da funçaõ de buscarFilmeId (400 ou 404 ou 500)
                }

            } else {
                return validarDados //retorno da funçaõ de valodar dados do filme 400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {

        return MESSAGE_DEFAULT.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const inserirReceita = async function (receita, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let dadosValidos = await validarDadosReceita(receita)

            if (!dadosValidos) {

                let result = await receitaDAO.setInsertReceita(receita)
                if (result) {
                    let lastIdReceita = await receitaDAO.getSelectLastIdReceita(receita)

                    if (lastIdReceita) {


                        for (cozinha of receita.cozinha) {
                            let receitaCozinha = {
                                id_receita: lastIdReceita,
                                id_cozinha: cozinha.id_cozinha
                            }
                        }

                        for (let ingrediente of receita.Ingredientes) {

                            await ingredienteReceitaDAO.insertIngredienteReceita({
                                receita_id: lastIdReceita,
                                ingrediente_id: ingrediente.id,
                                quantidade: ingrediente.quantidade,
                                unidade: ingrediente.unidade
                            })
                        }



                        //adiciona no Json de filme o ID que foi gerado no BD
                        receita.id = lastIdReceita
                        MESSAGE.HEADER.status = MESSAGE.SUCCES_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCES_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCES_CREATED_ITEM.message
                        MESSAGE.HEADER.response = receita


                        return MESSAGE.HEADER
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            } else {
                return dadosValidos
            }
        }
    } catch (eror) {
        console.log(eror)
        return MESSAGE_DEFAULT.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const deletarReceita = async function (id) {

    //apaga um filme filtrando pelo id
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (id != '' && id != null && id != undefined && !isNaN(id)) {

            let excluirReceita = await pegarIdReceita(id)

            if (excluirReceita.status_code == 200) {
                /*     console.log(excluirEmpresa, "AAAAAAAS") */

                let result = await receitaDAO.setDeleteReceita(parseInt(id))
                if (result) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETE_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETE_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETE_ITEM.message


                    return MESSAGE.HEADER
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            } else {
                return excluirReceita

            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS // 400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
    }
}

const validarDadosReceita = async function (receita) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (receita.titulo == '' || receita.titulo == null || receita.titulo == undefined || receita.titulo.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [Receita] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    } else if (receita.descricao == '' || receita.descricao == null || receita.descricao == undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [Descrição] invalido'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    } else if (receita.tempo_preparo == '' || receita.tempo_preparo == null || receita.tempo_preparo == undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [Receita] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    } else if (receita.dificuldade == '' || receita.dificuldade == null || receita.dificuldade == undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [Receita] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    } else if (receita.data_criacao == '' || receita.data_criacao == null || receita.data_criacao == undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [Receita] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    } else if (receita.data_edicao == '') {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [Receita] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    } else if (receita.imagem == '' || receita.imagem == null || receita.imagem == undefined || receita.imagem.length > 255) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [Receita] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    }
}
module.exports = {
    listarReceita,
    pegarIdReceita,
    inserirReceita,
    atualizarReceita,
    deletarReceita,
}