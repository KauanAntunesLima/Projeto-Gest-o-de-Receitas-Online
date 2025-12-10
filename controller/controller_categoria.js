/****************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entreo App e a Model 
 *           (validações, tratamento de dados, tratamento de errros, etc)
 * Data: 01/12/2025
 * Autor: Gabriel Cavalcante
 * Versão: 2.0
 ****************************************************************************************/
const categoriaDAO = require('../model/DAO/categoria.js')

const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

const listarCategoria = async function () {
    
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try{

        let result = await categoriaDAO.getSelectAllCategoria()
        if (result){
            if (result.length > 0){
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.categoria = result

             
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

const pegarIdCategoria = async function (id) {
    
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validaçaõ de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            //Chama a função para filtrar pelo ID
            let result = await categoriaDAO.getSelectByIdCategoria(parseInt(id))
         

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.categoria = result

                   
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

const inserirCategoria = async function (categoria, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let dadosValidos = await validarDadosCategoria(categoria)

            if (!dadosValidos) {

                let result = await categoriaDAO.setInsertCategoria(categoria)
                
                if (result) {

                    let lastIdCategoria = await categoriaDAO.getSelectLastIdCategoria(categoria)

                    if (lastIdCategoria) {

                        categoria.id_categotia = lastIdCategoria
                        MESSAGE.HEADER.status = MESSAGE.SUCCES_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCES_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCES_CREATED_ITEM.message
                        MESSAGE.HEADER.response = categoria


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

const atualizarCategoria = async function (categoria, id, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //validção do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosCategoria(categoria)

            if (!validarDados) {

                //chama a função para validar a consistencia do id e verificar se existe no banco de dados
                let validarId = await pegarIdCategoria(id)
                console.log(validarId)

                //verifica se o id existe no BD, caso exista teremos o status 200
                if (validarId.status_code == 200) {
                    categoria.id_categoria = parseInt(id)
                    console.log(categoria)
                    //Chama a função do DAO para atualizar um novo filme
                    let result = await categoriaDAO.setUpdateCategoria(categoria)
                    console.log(result)
                    if (result) {

                        MESSAGE.HEADER.status = MESSAGE.SUCCES_UPDATE_ITEM.status

                        MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_UPDATE_ITEM.status_code

                        MESSAGE.HEADER.message = MESSAGE.SUCCESS_UPDATE_ITEM.message

                        MESSAGE.HEADER.response = categoria

                        return MESSAGE.HEADER

                    } else {

                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL//500
                    }
                } else {
                    console.log('111111111111111')
                    return validarId 
                }

            } else {
                return validarDados 
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        console.log(error)

        return MESSAGE_DEFAULT.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const validarDadosCategoria = async function (categoria) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (categoria.nome == '' || categoria.nome == null || categoria.nome == undefined || categoria.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [nome] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    } else if (categoria.descricao == '') {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [descrição] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    } else {
        return false
    }

}

const deletarCategoria = async function (id) {
    
    //apaga um filme filtrando pelo id
        let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    
     try{
    
        if(id != '' && id!= null && id != undefined && !isNaN(id)){
    
            let excluirCategoria = await pegarIdCategoria(id)
           
            if (excluirCategoria.status_code == 200) {
            /*     console.log(excluirEmpresa, "AAAAAAAS") */
             
            let result = await categoriaDAO.setDeleteCategoria(parseInt(id))
         if(result){
            MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETE_ITEM.status
            MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETE_ITEM.status_code
            MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETE_ITEM.message
    
        
            return MESSAGE.HEADER
         }else{
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
         }
         }else{
           return excluirCategoria
           
         }
        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS // 400
        }
     }catch(error){
        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
     }
}

module.exports = {
    listarCategoria,
    pegarIdCategoria,
    inserirCategoria,
    atualizarCategoria,
    deletarCategoria
}