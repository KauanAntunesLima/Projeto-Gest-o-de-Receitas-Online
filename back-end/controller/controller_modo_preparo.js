/****************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entreo App e a Model 
 *           (validações, tratamento de dados, tratamento de errros, etc)
 * Data: 07/12/2025
 * Autor: Gabriel Cavalcante
 * Versão: 2.0
 ****************************************************************************************/
const modoPreparoDAO = require('../model/DAO/modo_preparo.js')

const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

const listarModoPreparo = async function () {
    
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try{

        let result = await modoPreparoDAO.getSelectAllModoPreparo()
        if (result){
            if (result.length > 0){
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.modo_preparo = result

             
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

const pegarIdModoPreparo = async function (id) {
    console.log(id)
    
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validaçaõ de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            //Chama a função para filtrar pelo ID
            let result = await modoPreparoDAO.getSelectByIdModoPreparo(parseInt(id))
            console.log(result)

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.modo_preparo = result

                    console.log(result)
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
const pegarModoPreparoPorIdReceita = async function (id) {

    
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validaçaõ de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            //Chama a função para filtrar pelo ID
            let result = await modoPreparoDAO.getSelectModoPreparoByIdReceita(parseInt(id))
            console.log(result)

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.modo_preparo = result

                    console.log(result)
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
      
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500

    }
}
const atualizarModoPreparo = async function (modoPreparo, id, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //validção do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosModoPreparo(modoPreparo)

            if (!validarDados) {

                //chama a função para validar a consistencia do id e verificar se existe no banco de dados
                let validarId = await pegarIdModoPreparo(id)


                //verifica se o id existe no BD, caso exista teremos o status 200
                if (validarId.status_code == 200) {
                   
                    modoPreparo.id_modo_preparo = parseInt(id)

                    //Chama a função do DAO para atualizar um novo filme
                    let result = await modoPreparoDAO.setUpdateModoPreparo(modoPreparo)

                    if (result) {


                        MESSAGE.HEADER.status = MESSAGE.SUCCES_UPDATE_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCES_UPDATE_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCES_UPDATE_ITEM.message
                        MESSAGE.HEADER.response = modoPreparo

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

const inserirModoPreparo = async function (modoPreparo, contentType) {
    console.log(modoPreparo, contentType)
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let dadosValidos = await validarDadosModoPreparo(modoPreparo)

            if (!dadosValidos){
               
                let result = await modoPreparoDAO.setInsertModoPreparo(modoPreparo)

            if (result) {
                let lastIdModoPreparo = await modoPreparoDAO.getSelectLastIdModoPreparo(modoPreparo)

                if (lastIdModoPreparo) {

                    //adiciona no Json de filme o ID que foi gerado no BD
                    modoPreparo.id_modo_preparo = lastIdModoPreparo
                    MESSAGE.HEADER.status = MESSAGE.SUCCES_CREATED_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCES_CREATED_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCES_CREATED_ITEM.message
                    MESSAGE.HEADER.response = modoPreparo

                 
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

const deletarModoPreparo = async function (id) {
   

        let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    
     try{
    
        if(id != '' && id!= null && id != undefined && !isNaN(id)){
    
            let excluirModoPreparo = await pegarIdModoPreparo(id)
           
            if (excluirModoPreparo.status_code == 200) {
     
            let result = await modoPreparoDAO.setDeleteModoPreparo(parseInt(id))
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

const validarDadosModoPreparo = async function (modoPreparo){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
   
    if(modoPreparo.numero_passo == '' || modoPreparo.numero_passo == null || modoPreparo.numero_passo == undefined){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [numero_passo] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    }else if(modoPreparo.descricao == '' || modoPreparo.descricao == null || modoPreparo.descricao == undefined){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [descrição] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    }else{
        return false
    }
}

module.exports = {
    listarModoPreparo,
    pegarIdModoPreparo,
    pegarModoPreparoPorIdReceita,
    atualizarModoPreparo,
    inserirModoPreparo,
    deletarModoPreparo
}