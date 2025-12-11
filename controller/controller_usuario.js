/****************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entreo App e a Model 
 *           (validações, tratamento de dados, tratamento de errros, etc)
 * Data: 01/12/2025
 * Autor: Gabriel Cavalcante
 * Versão: 2.0
 ****************************************************************************************/
const usuarioDAO = require('../model/DAO/usuario.js')
const criptografia = require('../modulo/crypto-password.js')

const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

const listarUsuario = async function () {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        let result = await usuarioDAO.getSelectAllUsuario()
        if (result) {
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.usuario = result

                return MESSAGE.HEADER
            } else {
                return MESSAGE.ERROR_NOT_FOUND
            }
        } else {
            return MESSAGE_DEFAULT.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const pegarIdUsuario = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            //Chama a função para filtrar pelo ID
            let result = await usuarioDAO.getSelectByIdUsuario(parseInt(id))

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.usuario = result

                    return MESSAGE.HEADER //200
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

    } catch (eror) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500

    }
}

const atualizarUsuario = async function (usuario, id, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //validção do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
           
            //chama a função de validação dos dados do usuario
            let validarDados = await validarDadosUsuario(usuario)

            if (!validarDados) {
              
                //chama a função para validar a consistencia do id e verificar se existe no banco de dados
                let validarId = await pegarIdUsuario(id)

                //verifica se o id existe no BD, caso exista teremos o status 200
                if (validarId.status_code == 200) {
                    usuario.id_usuario = parseInt(id)
                 
                    //Chama a função do DAO para atualizar um novo usuario
                    let result = await usuarioDAO.setUpdateUsuario(usuario)

                    if (result) {

                        MESSAGE.HEADER.status = MESSAGE.SUCCES_UPDATE_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCES_UPDATE_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCES_UPDATE_ITEM.message
                        MESSAGE.HEADER.response = usuario

                      
                        return MESSAGE.HEADER
                    } else {

                        return MESSAGE.ERROR_INERNAL_SERVER_MODEL//500
                    }
                } else {

                    return validarId 
                }

            } else {
                return validarDados 
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {

        return MESSAGE_DEFAULT.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const inserirUsuario = async function (usuario, contentType) {
    console.log(usuario)
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let dadosValidos = await validarDadosUsuario(usuario)

            if (!dadosValidos) {

                let senhaCriptografada = criptografia.hashPassword(usuario.senha)

                let usuarioCriptografado = {
                    nome: usuario.nome,
                    email: usuario.email,
                    senha: senhaCriptografada,
                    imagem: usuario.imagem
                  }
                  console.log(usuarioCriptografado)
                let result = await usuarioDAO.setInsertUsuario(usuarioCriptografado)
                
                if (result) {

                    let lastIdUsuario = await usuarioDAO.getSelectLastIdUsuario(usuario)

                    if (lastIdUsuario) {

                        usuario.id_usuario = lastIdUsuario
                        MESSAGE.HEADER.status = MESSAGE.SUCCES_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCES_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCES_CREATED_ITEM.message
                        MESSAGE.HEADER.response = usuario


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
        return MESSAGE_DEFAULT.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

const loginUsuario = async function (usuario) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

        try {

            const user = await usuarioDAO.getUsuarioByUsuarioNome(usuario.nome);
            console.log(user)
            if (!user) {

                return MESSAGE.ERROR_REQUIRED_FIELDS;
                
            }

            let senhaVerificada = criptografia.verifyPassword(usuario.senha, user.senha)

            if(senhaVerificada){

                delete user.senha
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.usuario = user
                console.log(user)
                return MESSAGE.HEADER //200
            }

        } catch (error) {
            return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER;
        }
    }

const deletarUsuario = async function (id) {
    console.log(id)
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (id != '' && id != null && id != undefined && !isNaN(id)) {

            let excluirUsuario = await pegarIdUsuario(id)

            
            if (excluirUsuario.status_code == 200) {
               
                let idUser = parseInt(id)
                console.log(idUser)
                let result = await usuarioDAO.setDeleteUsuario(idUser)

                if (result) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETE_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETE_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETE_ITEM.message

                    return MESSAGE.HEADER
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            } else {
                return excluirUsuario

            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS // 400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
    }
}

const validarDadosUsuario = async function (usuario) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (usuario.nome == '' || usuario.nome == null || usuario.nome == undefined || usuario.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [nome] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    } else if (usuario.email == '' || usuario.email == null || usuario.email == undefined || usuario.email.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [email] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    }else if(usuario.senha == '' || usuario.senha == null || usuario.senha == undefined || usuario.senha.length > 50){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [senha] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    }else{
        return false
    }
}
    

module.exports = {
    listarUsuario,
    pegarIdUsuario,
    atualizarUsuario,
    inserirUsuario,
    deletarUsuario,
    loginUsuario
}
