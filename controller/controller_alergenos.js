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

    try {

        let result = await alergenosDAO.getSelectAllAlergenos()
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

const pegarIdAlergenos = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            //Chama a função para filtrar pelo ID
            let result = await alergenosDAO.getSelectByIdAlergenos(parseInt(id))

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

const atualizarAlergenos = async function (alergenos, id, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //validção do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosAlergenos(receita)

            if (!validarDados) {

                //chama a função para validar a consistencia do id e verificar se existe no banco de dados
                let validarId = await buscarFilmeId(id)

                //verifica se o id existe no BD, caso exista teremos o status 200
                if (validarId.status_code == 200) {
                    alergenos.id = parseInt(id)

                    //Chama a função do DAO para atualizar um novo filme
                    let result = await alergenosDAO.setUpdateAlergenos(alergenos)

                    if (result) {


                        MESSAGE.HEADER.status = MESSAGE.SUCCES_UPDATE_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCES_UPDATE_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCES_UPDATE_ITEM.message
                        MESSAGE.HEADER.response = alergenos

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

const inserirAlergenos = async function (alergenos, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let dadosValidos = await validarDadosAlergenos(alergenos)

            if (!dadosValidos){
              
            if (result) {

                let lastIdAlergenos = await alergenosDAO.setInsertAlergenos()

                if (lastIdAlergenos) {

                    alergenos.id = lastIdAlergenos
                    MESSAGE.HEADER.status = MESSAGE.SUCCES_CREATED_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCES_CREATED_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCES_CREATED_ITEM.message
                    MESSAGE.HEADER.response = alergenos

                
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
    return MESSAGE_DEFAULT.ERROR_INTERNAL_SERVER_CONTROLLER //500
}

}

const deletarAlergenos = async function (id) {
    //apaga um filme filtrando pelo id
            let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
        
         try{
        
            if(id != '' && id!= null && id != undefined && !isNaN(id)){
        
                let excluirAlergenos = await pegarIdAlergenos(id)
               
                if (excluirAlergenos.status_code == 200) {
                 
                let result = await alergenosDAO.setDeleteAlergenos(parseInt(id))
             if(result){
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETE_ITEM.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETE_ITEM.status_code
                MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETE_ITEM.message
        
            
                return MESSAGE.HEADER
             }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
             }
             }else{
               return excluirAlergenos
               
             }
            }else{
                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!'
                return MESSAGE.ERROR_REQUIRED_FIELDS // 400
            }
         }catch(error){
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
         }
}

const validarDadosAlergenos = async function (alergenos) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (alergenos.nome == '' || alergenos.nome == null || alergenos.nome == undefined || alergenos.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [nome] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    } else if (alergenos.descricao == '' || alergenos.descricao == null || alergenos.descricao == undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [descrição] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    }

}

module.exports = {
    listarAlergenos,
    pegarIdAlergenos,
    atualizarAlergenos,
    inserirAlergenos,
    deletarAlergenos
}
