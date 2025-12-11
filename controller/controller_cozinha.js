/****************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o App e a Model 
 *           (validações, tratamento de dados, tratamento de erros, etc)
 * Data: 05/12/2025
 * Autor: Kauan Antunes Lima
 * Versão: 2.0
 ****************************************************************************************/
const cozinhaDAO = require('../model/DAO/cozinha.js')

const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

const listarCozinha = async function () {
    
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try{

        let result = await cozinhaDAO.getSelectAllCozinha()
        if (result){
            if (result.length > 0){
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.cozinha = result

             
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

const pegarIdCozinha = async function (id) {
    
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validaçaõ de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            //Chama a função para filtrar pelo ID
            let result = await cozinhaDAO.getSelectByIdCozinha(parseInt(id))
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
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido' //400
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500

    }
}

const atualizarCozinha = async function (cozinha, id, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //validção do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
           
            //chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosCozinha(cozinha)

            if (!validarDados) {
              
                //chama a função para validar a consistencia do id e verificar se existe no banco de dados
                let validarId = await pegarIdCozinha(id)

                //verifica se o id existe no BD, caso exista teremos o status 200
                if (validarId.status_code == 200) {
                    cozinha.id_cozinha = parseInt(id)
                 
                    //Chama a função do DAO para atualizar um novo filme
                    let result = await cozinhaDAO.setUpdateCozinha(cozinha)

                    if (result) {

                        MESSAGE.HEADER.status = MESSAGE.SUCCES_UPDATE_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCES_UPDATE_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCES_UPDATE_ITEM.message
                        MESSAGE.HEADER.response = cozinha

                      
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


const inserirCozinha = async function (cozinha, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let dadosValidos = await validarDadosCozinha(cozinha)

            if (!dadosValidos){
               
                let result = await cozinhaDAO.setInsertCozinha(cozinha)
            if (result) {
                let lastIdCozinha = await cozinhaDAO.getSelectLastIdCozinha(cozinha)

                if (lastIdCozinha) {

         
                    cozinha.id_cozinha = lastIdCozinha
                    MESSAGE.HEADER.status = MESSAGE.SUCCES_CREATED_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCES_CREATED_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCES_CREATED_ITEM.message
                    MESSAGE.HEADER.response = cozinha

                 
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

const deletarCozinha = async function (id) {
    

        let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    
     try{
    
        if(id != '' && id!= null && id != undefined && !isNaN(id)){
    
            let excluirCozinha = await pegarIdCozinha(id)
           
            if (excluirCozinha.status_code == 200) {
     
             
            let result = await cozinhaDAO.setDeleteCozinha(parseInt(id))
         if(result){
            MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETE_ITEM.status
            MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETE_ITEM.status_code
            MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETE_ITEM.message
    
        
            return MESSAGE.HEADER
         }else{
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
         }
         }else{
           return excluirReceita
           
         }
        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS // 400
        }
     }catch(error){
        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
     }
}

const validarDadosCozinha = async function (cozinha){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
   
    
     if(cozinha.nome == '' || cozinha.nome == null || cozinha.nome == undefined || cozinha.nome.length > 100){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [Cozinha] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    }
}



module.exports = {
    listarCozinha,
    pegarIdCozinha,
    atualizarCozinha,
    inserirCozinha,
    deletarCozinha,
    validarDadosCozinha
    
}
