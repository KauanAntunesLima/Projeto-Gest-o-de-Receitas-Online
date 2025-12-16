/****************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o App e a Model 
 *           (validações, tratamento de dados, tratamento de erros, etc)
 * Data: 05/12/2025
 * Autor: Kauan Antunes Lima
 * Versão: 2.0
 ****************************************************************************************/
const receitaCozinhaDAO = require('../model/DAO/receita_cozinha.js')

const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

const listarReceitaCozinha = async function () {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //Chama a função do DAO para retornar a lista de filmes  gêneros
        let result = await receitaCozinhaDAO.getSelectAllReceitaCozinha()

        if (result) {
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.receitaCozinha = result

                return MESSAGE.HEADER //200
            } else {
                return MESSAGE.ERROR_NOT_FOUND //404
            }
        } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const buscarCozinhaReceitaId = async function (id) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chama a função para filtrar pelo ID
            let result = await receitaCozinhaDAO.getSelectBYIdReceitaCozinha(parseInt(id))
            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.receitaCozinha = result

                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] invalido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

const listarCozinhaIdReceita = async function (idReceita) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (idReceita != '' && idReceita != null && idReceita != undefined && !isNaN(idReceita) && idReceita > 0) {
            //Chama a função para filtrar pelo ID
            let result = await receitaCozinhaDAO.getSelectReceitaByIdCozinha(parseInt(idReceita))
            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.cozinha = result

                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_FILME] invalido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const listarReceitaIdCozinha = async function (idCozinha) {
    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (idCozinha != '' && idCozinha != null && idCozinha != undefined && !isNaN(idCozinha) && idCozinha > 0) {
            //Chama a função para filtrar pelo ID
            let result = await receitaCozinhaDAO.getSelectCozinhaByIdReceita(parseInt(idCozinha))
            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.receita = result

                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_GENERO] invalido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const inserirReceitaCozinha = async function (receitaCozinha, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validarDadosReceitaCozinha(receitaCozinha)

            if (!validarDados) {

                //Chama a função do DAO para inserir um novo filme
                let result = await receitaCozinhaDAO.setInsertReceitaCozinha(receitaCozinha)

                if (result) {

                    //Chama a função para receber o ID gerado no BD
                    let lastIdReceitaCozinha = await receitaCozinhaDAO.getSelectLastIdReceitaCozinha()

                    if (lastIdReceitaCozinha) {

                        //Adiciona no JSON de filme gênero o ID que foi gerado pelo BD
                        receitaCozinha.id_receita_cozinha = lastIdReceitaCozinha
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = receitaCozinha

                        return MESSAGE.HEADER //201
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            } else {
                return validarDados //400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const atualizarReceitaCozinha = async function (receitaCozinha, id, contentType) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosReceitaCozinha(receitaCozinha)

            if (!validarDados) {

                //Chama a função para validar a consistencia do ID e verificar se existe no BD
                let validarID = await buscarCozinhaReceitaId(id)

                //Verifica se o ID existe no BD, caso exista teremos o status 200
                if (validarID.status_code == 200) {

                    //Adicionando o ID no JSON com os dados da
                    receitaCozinha.id_receita_cozinha = parseInt(id)

                    //Chama a função do DAO para atualizar uma cozinha
                    let result = await receitaCozinhaDAO.setUpdateReceitaCozinha(receitaCozinha)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = receitaCozinha

                        return MESSAGE.HEADER //200
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return validarID //Retorno da função de buscarFilmeGeneroId (400 ou 404 ou 500)
                }
            } else {
                return validarDados //Retorno da função de validar dados do Filme Gênero 400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

const excluirReceitaCozinha = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            let validarID = await buscarCozinhaReceitaId(id)

            if (validarID.status_code == 200) {

                let result = await receitaCozinhaDAO.setDeleteReceitaCozinha(parseInt(id))

                if (result) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETE_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETE_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETE_ITEM.message

                    delete MESSAGE.HEADER.response
                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            } else {
                return validarID //Retorno da função de buscarGeneroId (400 ou 404 ou 500)
            }

        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] invalido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

const excluirCozinhaPorReceita = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            let validarID = await buscarCozinhaReceitaId(id)

            if (validarID.status_code == 200) {

                let result = await receitaCozinhaDAO.setDeleteByIdCozinhaAndReceitaId(parseInt(id))

                console.log(result)
                if (result) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETE_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETE_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETE_ITEM.message

                    delete MESSAGE.HEADER.response
                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            } else {
                return validarID //Retorno da função de buscarGeneroId (400 ou 404 ou 500)
            }

        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] invalido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

const validarDadosReceitaCozinha = async function (receitaCozinha) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (receitaCozinha.id_receita == '' || receitaCozinha.id_receita == null || receitaCozinha.id_receita == undefined || isNaN(receitaCozinha.id_receita) || receitaCozinha.id_receita <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_RECEITA] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (receitaCozinha.id_cozinha == '' || receitaCozinha.id_cozinha == null || receitaCozinha.id_cozinha == undefined || isNaN(receitaCozinha.id_cozinha) || receitaCozinha.id_cozinha <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_COZINHA] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } else {
        return false
    }

}

module.exports = {
    listarReceitaCozinha,
    buscarCozinhaReceitaId,
    listarReceitaIdCozinha,
    inserirReceitaCozinha,
    listarCozinhaIdReceita,
    atualizarReceitaCozinha,
    excluirReceitaCozinha,
    excluirCozinhaPorReceita
}