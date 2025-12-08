/****************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o App e a Model
 *           (validações, tratamento de dados, tratamento de erros, etc)
 * Data: 08/12/2025
 * Autor: Roge Ribeiro
 * Versão: 1.1
 ****************************************************************************************/

const receitaIngredientesDAO = require('../model/DAO/receita_ingredientes.js');
const MESSAGE_DEFAULT = require('../modulo/config_messages.js');

const listarReceitaIngredientes = async function () {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    try {
        let result = await receitaIngredientesDAO.getSelectAllReceitaIngredientes();
        if (result) {
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status;
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code;
                MESSAGE.HEADER.response.receita_ingredientes = result;
                return MESSAGE.HEADER;
            } else {
                return MESSAGE.ERROR_NOT_FOUND;
            }
        } else {
            return MESSAGE_DEFAULT.ERROR_INTERNAL_SERVER_MODEL;
        }
    } catch (error) {
        console.log(error);
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
};

const pegarReceitaIngredientePorId = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    try {
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            let result = await receitaIngredientesDAO.getSelectReceitaIngredientesById(id);

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status;
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code;
                    MESSAGE.HEADER.response.receita_ingredientes = result;
                    return MESSAGE.HEADER;
                } else {
                    return MESSAGE.ERROR_NOT_FOUND;
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL;
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido';
            return MESSAGE.ERROR_REQUIRED_FIELDS;
        }
    } catch (error) {
        console.log(error);
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
};


const inserirReceitaIngrediente = async function (receitaIngrediente, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    try {
        if (String(contentType).toUpperCase() === 'APPLICATION/JSON') {
            let dadosInvalidos = validarDadosReceitaIngrediente(receitaIngrediente);
            if (!dadosInvalidos) {
                let result = await receitaIngredientesDAO.insertReceitaIngredientes(receitaIngrediente);
                if (result) {
                    let lastId = await receitaIngredientesDAO.getSelectLastIdReceitaIngrediente();
                    if (lastId) {
                        receitaIngrediente.id_receita_ingredientes = lastId;
                        MESSAGE.HEADER.status = MESSAGE.SUCCES_CREATED_ITEM.status;
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCES_CREATED_ITEM.status_code;
                        MESSAGE.HEADER.message = MESSAGE.SUCCES_CREATED_ITEM.message;
                        MESSAGE.HEADER.response = receitaIngrediente;
                        return MESSAGE.HEADER;
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL;
                    }
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL;
                }
            } else {
                return dadosInvalidos;
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE;
        }
    } catch (error) {
        console.log(error);
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
};


const atualizarReceitaIngrediente = async function (receitaIngrediente, id, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    try {
        if (String(contentType).toUpperCase() === 'APPLICATION/JSON') {
            let dadosInvalidos = validarDadosReceitaIngrediente(receitaIngrediente);
            if (!dadosInvalidos) {
                let registroExistente = await pegarReceitaIngredientePorId(id);
                if (registroExistente.status_code === 200) {
                    receitaIngrediente.id_receita_ingredientes = parseInt(id);
                    let result = await receitaIngredientesDAO.setUpdateReceitaIngredientes(receitaIngrediente);
                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCCES_UPDATE_ITEM.status;
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCES_UPDATE_ITEM.status_code;
                        MESSAGE.HEADER.message = MESSAGE.SUCCES_UPDATE_ITEM.message;
                        MESSAGE.HEADER.response = receitaIngrediente;
                        return MESSAGE.HEADER;
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL;
                    }
                } else {
                    return registroExistente;
                }
            } else {
                return dadosInvalidos;
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE;
        }
    } catch (error) {
        console.log(error);
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
};


const deletarReceitaIngrediente = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    try {
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            let registroExistente = await pegarReceitaIngredientePorId(id);
            if (registroExistente.status_code === 200) {
                let result = await receitaIngredientesDAO.setDeleteReceitaIngredientes(parseInt(id));
                if (result) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETE_ITEM.status;
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETE_ITEM.status_code;
                    MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETE_ITEM.message;
                    return MESSAGE.HEADER;
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL;
                }
            } else {
                return registroExistente;
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido';
            return MESSAGE.ERROR_REQUIRED_FIELDS;
        }
    } catch (error) {
        console.log(error);
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
};


const validarDadosReceitaIngrediente = (receitaIngrediente) => {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    if (!receitaIngrediente.id_receita || isNaN(receitaIngrediente.id_receita) || receitaIngrediente.id_receita <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [id_receita] inválido";
        return MESSAGE.ERROR_REQUIRED_FIELDS; // 400
    } else if (!receitaIngrediente.id_ingredientes || isNaN(receitaIngrediente.id_ingredientes) || receitaIngrediente.id_ingredientes <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [id_ingredientes] inválido";
        return MESSAGE.ERROR_REQUIRED_FIELDS; // 400
    } else if (receitaIngrediente.quantidade == null || isNaN(receitaIngrediente.quantidade) || receitaIngrediente.quantidade <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [quantidade] inválido";
        return MESSAGE.ERROR_REQUIRED_FIELDS; // 400
    } else if (!receitaIngrediente.unidade || receitaIngrediente.unidade.trim() === '' || receitaIngrediente.unidade.length > 20) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [unidade] inválido";
        return MESSAGE.ERROR_REQUIRED_FIELDS; // 400
    } else {
        return false; // Dados válidos
    }
};



module.exports = {
    listarReceitaIngredientes,
    pegarReceitaIngredientePorId,
    inserirReceitaIngrediente,
    atualizarReceitaIngrediente,
    deletarReceitaIngrediente
};
