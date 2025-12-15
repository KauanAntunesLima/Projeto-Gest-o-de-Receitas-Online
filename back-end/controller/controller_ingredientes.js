/****************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entreo App e a Model 
 *           (validações, tratamento de dados, tratamento de errros, etc)
 * Data: 05/12/2025
 * Autor: Gabriel Cavalcante
 * Versão: 2.0
 ****************************************************************************************/
const ingredientesDAO = require('../model/DAO/ingredientes.js')

const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

const listarIngredientes = async function () {
    
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try{

        let result = await ingredientesDAO.getSelectAllIngredientes()
        if (result){
            if (result.length > 0){
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.ingrediente = result

             
                return MESSAGE.HEADER
            }else{
                return MESSAGE.ERROR_NOT_FOUND
            }
        }else{
            return MESSAGE_DEFAULT.ERROR_INTERNAL_SERVER_MODEL
        }

    }catch (error){
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const pegarIdIngrediente = async function (id) {
    
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validaçaõ de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            //Chama a função para filtrar pelo ID
            let result = await ingredientesDAO.getSelectByIdIngredientes(parseInt(id))

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.ingrediente = result

                    
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

    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500

    }
}

const inserirIngrediente = async function (ingrediente, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let dadosValidos = await validarDadosIngrediente(ingrediente)

            if (!dadosValidos){
               
                let result = await ingredientesDAO.setInsertReceita(ingrediente)
            if (result) {
                let lastIdIngrediente = await ingredientesDAO.getSelectLastIdIngrediente(ingrediente)

                if (lastIdIngrediente) {

                   
                    ingrediente.id_ingredientes = lastIdIngrediente
                    MESSAGE.HEADER.status = MESSAGE.SUCCES_CREATED_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCES_CREATED_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCES_CREATED_ITEM.message
                    MESSAGE.HEADER.response = ingrediente

                 
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
}catch (eror){
    console.log(eror)
    return MESSAGE_DEFAULT.ERROR_INTERNAL_SERVER_CONTROLLER //500
}
}

const atualizarIngredientes = async function (ingredientes, id, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //validção do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
           
 
            let validarDados = await validarDadosIngrediente(ingredientes)

            if (!validarDados) {
              
           
                let validarId = await pegarIdIngrediente(id)

                //verifica se o id existe no BD, caso exista teremos o status 200
                if (validarId.status_code == 200) {
                    ingredientes.id_ingredientes = parseInt(id)
                 
             
                    let result = await ingredientesDAO.setUpdateIngredientes(ingredientes)

                    if (result) {

                        MESSAGE.HEADER.status = MESSAGE.SUCCES_UPDATE_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCES_UPDATE_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCES_UPDATE_ITEM.message
                        MESSAGE.HEADER.response = ingredientes

                      
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

const deletarIngrediente = async function (id) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (id != '' && id != null && id != undefined && !isNaN(id)) {

            let excluirIngrediente = await pegarIdIngrediente(id)

            if (excluirIngrediente.status_code == 200) {

                let result = await ingredientesDAO.setDeleteIngredientes(parseInt(id))
                if (result) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETE_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETE_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETE_ITEM.message


                    return MESSAGE.HEADER
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            } else {
                return excluirIngrediente

            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS // 400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
    }
}

const validarDadosIngrediente = async function (ingredientes) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (ingredientes.nome == '' || ingredientes.nome == null || ingredientes.nome == undefined || ingredientes.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [nome] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    } else if (ingredientes.tipo == '' || ingredientes.tipo == null || ingredientes.tipo == undefined || ingredientes.tipo.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [tipo] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    }

}

module.exports = {
    listarIngredientes,
    pegarIdIngrediente,
    inserirIngrediente,
    atualizarIngredientes,
    deletarIngrediente
}