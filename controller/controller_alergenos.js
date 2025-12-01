/****************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entreo App e a Model 
 *           (validações, tratamento de dados, tratamento de errros, etc)
 * Data: 01/12/2025
 * Autor: Gabriel Cavalcante
 * Versão: 2.0
 ****************************************************************************************/
const alergenosDAO = require('../model/DAO/alergenos.js')

const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

const listarAlergenos = async function () {
    
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try{

        let result = await alergenosDAO.getSelectAllAlergenos()
        if (result){
            if (result.length > 0){
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.alergenos = result

                return MESSAGE.HEADER
            }else{
                return MESSAGE.ERROR_NOT_FOUND
            }
        }else{
            return MESSAGE_DEFAULT.ERROR_INTERNAL_SERVER_MODEL
        }

    }catch (error){
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

