/****************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o App e a Model 
 *           (validações, tratamento de dados, tratamento de erros, etc)
 * Data: 01/12/2025
 * Autor: Roger Ribeiro
 * Versão: 2.0
 ****************************************************************************************/
const ingredienteAlergenosDAO = require('../model/DAO/ingrediente_alergenos.js')

const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

const listaIngredientesAlergenos = async function () {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        let result = await ingredienteAlergenosDAO.getSelectAllIngredientesAlergenos()
        if (result) {
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.alergenos = result

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

const pegarIngredientesAlergenosPorId = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            let result = await ingredienteAlergenosDAO.getSelectIngredienteAlergenosById(parseInt(id))

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.alergenos = result

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
const pegarIngredientesAlergenosPorIngredientesId = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            let result = await ingredienteAlergenosDAO.getSelectIngredienteAlergenosByIngredienteId(parseInt(id))

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.alergenos = result

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


const atualizarIngredienteAlergenos = async function (ingredienteAlergenos, id, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

    
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
           
 
            let validarDados = await validarDadosIngredienteAlergenos(ingredienteAlergenos)

            if (!validarDados) {
              
         
                let validarId = await pegarIngredientesAlergenosPorIdIdAlergenos(id)

              
                if (validarId.status_code == 200) {
                    ingredienteAlergenos.id_alergenos = parseInt(id)
                 
         
                    let result = await ingredienteAlergenosDAO.setUpdateIngredienteAlergenos(ingredienteAlergenos)

                    if (result) {

                        MESSAGE.HEADER.status = MESSAGE.SUCCES_UPDATE_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCES_UPDATE_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCES_UPDATE_ITEM.message
                        MESSAGE.HEADER.response = ingredienteAlergenos

                      
                        return MESSAGE.HEADER
                    } else {

                        return MESSAGE.ERROR_INERNAL_SERVER_MODEL
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

const inserirIngredientesAlergenos = async function (ingredienteAlergenos, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let dadosValidos = await validarDadosIngredienteAlergenos(ingredienteAlergenos)

            if (!dadosValidos) {

                let result = await alergenosDAO.setInsertAlergenos(ingredienteAlergenos)
                
                if (result) {

                    let lastIdAlergenos = await ingredienteAlergenosDAO.insertIngredienteAlergenos(ingredienteAlergenos)

                    if (lastIdAlergenos) {

                        ingredienteAlergenos.id = lastIdAlergenos
                        MESSAGE.HEADER.status = MESSAGE.SUCCES_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCES_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCES_CREATED_ITEM.message
                        MESSAGE.HEADER.response = ingredienteAlergenos


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
    } catch (error) {
        return MESSAGE_DEFAULT.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

const deletarIngredientesAlergenos = async function (id) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (id != '' && id != null && id != undefined && !isNaN(id)) {

            let excluirAlergenos = await pegarIngredientesAlergenosPorId(id)

            if (excluirAlergenos.status_code == 200) {

                let result = await ingredienteAlergenosDAO.setDeleteIngredienteAlergenos(parseInt(id))
                if (result) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETE_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETE_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETE_ITEM.message


                    return MESSAGE.HEADER
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            } else {
                return excluirAlergenos

            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS // 400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
    }
}


const validarDadosIngredienteAlergenos = async function (ingredienteAlergenos) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (ingredienteAlergenos.id_ingredientes_alergenos == '' || ingredienteAlergenos.id_ingredientes_alergenos == null || ingredienteAlergenos.id_ingredientes_alergenos == undefined || isNaN(ingredienteAlergenos.id_ingredientes_alergenos) || ingredienteAlergenos.id_receita <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_RECEITA] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (ingredienteAlergenos.id_alergenos == '' || ingredienteAlergenos.id_alergenos == null || ingredienteAlergenos.id_alergenos == undefined || isNaN(ingredienteAlergenos.id_alergenos) || ingredienteAlergenos.id_alergenos <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [id_alergenos] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } else if (ingredienteAlergenos.id_ingredientes == '' || ingredienteAlergenos.id_ingredientes == null || ingredienteAlergenos.id_ingredientes == undefined || isNaN(ingredienteAlergenos.id_ingredientes) || ingredienteAlergenos.id_ingredientes <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [id_ingredientes] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    } else {
        return false
    }

}

module.exports = {
    listaIngredientesAlergenos,
    pegarIngredientesAlergenosPorId,
    pegarIngredientesAlergenosPorIngredientesId,
    atualizarIngredienteAlergenos,
    inserirIngredientesAlergenos,
    deletarIngredientesAlergenos
}
