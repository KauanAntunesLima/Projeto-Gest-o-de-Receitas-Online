/****************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o App e a Model 
 *           (validações, tratamento de dados, tratamento de erros, etc)
 * Data: 10/12/2025
 * Autor: Gabriel Cavalcante dos Santos
 * Versão: 2.0
 ****************************************************************************************/
const usuarioNotasReceitaDAO = require('../model/DAO/usuario_notas_receita.js')

const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

const listarUsuarioNotasReceita = async function() {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

        try {

        //Chama a função do DAO para retornar a lista de filmes  gêneros
        let result = await usuarioNotasReceitaDAO.getSelectAllUsuarioNotasReceita()
       
        if (result) {
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.usuarioNotasReceita = result

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

const buscarUsuarioNotasReceitaId = async function (id) {

     let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

        try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chama a função para filtrar pelo ID
            let result = await usuarioNotasReceitaDAO.getSelectByIdUsuarioNotasReceita(parseInt(id))
            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.usuarioNotasReceita = result

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

const inserirUsuarioNotasReceita = async function (usuarioNotasReceita, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
        try {
           
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validarDadosUsuarioNotasReceita(usuarioNotasReceita)

            if (!validarDados) {

                //Chama a função do DAO
                let result = await usuarioNotasReceitaDAO.setinsertUsuarioNotasReceita(usuarioNotasReceita)

                if (result) {

                    let lastIdUsuarioNotasReceita = await usuarioNotasReceitaDAO.getSelectLastIdUsuarioNotasReceita(usuarioNotasReceita)

                    if (lastIdUsuarioNotasReceita) {

                        usuarioNotasReceita.id_usuario_notas_receita = lastIdUsuarioNotasReceita
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response = usuarioNotasReceita

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

const atualizarUsuarioNotasReceita = async function (usuarioNotasReceita, id, contentType) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //Chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosUsuarioNotasReceita(usuarioNotasReceita)

            if (!validarDados) {

                //Chama a função para validar a consistencia do ID e verificar se existe no BD
                let validarID = await buscarUsuarioNotasReceitaId(id)

                //Verifica se o ID existe no BD, caso exista teremos o status 200
                if (validarID.status_code == 200) {

                    //Adicionando o ID no JSON com os dados 
                    usuarioNotasReceita.id_usuario_notas_receita = parseInt(id)

                    let result = await usuarioNotasReceitaDAO.setUpdateUsuarioNotasReceita(usuarioNotasReceita)

                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = usuarioNotasReceita

                        return MESSAGE.HEADER //200
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                } else {
                    return validarID
                }
            } else {
                return validarDados 
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

const validarDadosUsuarioNotasReceita = async function (usuarioNotasReceita) {

   let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (usuarioNotasReceita.id_receita == '' || usuarioNotasReceita.id_receita == null || usuarioNotasReceita.id_receita == undefined || isNaN(usuarioNotasReceita.id_receita) || usuarioNotasReceita.id_receita < 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_RECEITA] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (usuarioNotasReceita.id_usuario == '' || usuarioNotasReceita.id_usuario == null || usuarioNotasReceita.id_usuario == undefined || isNaN(usuarioNotasReceita.id_usuario) || usuarioNotasReceita.id_usuario < 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_Usuario] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } 
    else if(usuarioNotasReceita.nota == '' || usuarioNotasReceita.nota == null || usuarioNotasReceita == undefined || usuarioNotasReceita.nota.length > 2.1){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOTA] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else if (usuarioNotasReceita.descricao == '' || usuarioNotasReceita.descricao == null || usuarioNotasReceita.descricao == undefined || usuarioNotasReceita.nota.length > 200){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOTA] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else  {
        return false
    }

}

const excluirUsuarioNotasReceita = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            let validarID = await buscarUsuarioNotasReceitaId(id)

            if (validarID.status_code == 200) {

                let result = await usuarioNotasReceitaDAO.setDeleteUsuarioNotasReceita(parseInt(id))

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

const excluirNotaReceitaPorUsuario = async function (id) {

    //Realizando uma cópia do objeto MESSAGE_DEFAULT, permitindo que as alterações desta função
    //não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            let validarID = await buscarUsuarioNotasReceitaId(id)

            if (validarID.status_code == 200) {

                let result = await usuarioNotasReceitaDAO.setDeleteByIdUsuarioAndReceitaId(parseInt(id))

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

module.exports = {
    listarUsuarioNotasReceita,
    buscarUsuarioNotasReceitaId,
    listarUsuarioNotasReceita,
    inserirUsuarioNotasReceita,
    listarUsuarioNotasReceita,
    atualizarUsuarioNotasReceita,
    excluirUsuarioNotasReceita,
    excluirNotaReceitaPorUsuario
}