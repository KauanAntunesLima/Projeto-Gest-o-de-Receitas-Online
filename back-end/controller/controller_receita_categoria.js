/****************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entre o App e a Model
 *           (validações, tratamento de dados, tratamento de erros, etc)
 * Data: 10/12/2025
 * Autor: Kauan Antunes
 * Versão: 1.0
 ****************************************************************************************/

const receitaCategoriaDAO = require('../model/DAO/receita_categoria.js');
const MESSAGE_DEFAULT = require('../modulo/config_messages.js');

const listarReceitaCategoria = async function () {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    try {
        let result = await receitaCategoriaDAO.getSelectAllReceitaCategoria();
        if (result) {
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status;
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code;
                MESSAGE.HEADER.response.receita_categoria = result;
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

const pegarReceitaCategoriaPorId = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    try {
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            let result = await receitaCategoriaDAO.getSelectReceitaCategoriaById(id);

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status;
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code;
                    MESSAGE.HEADER.response.receita_categoria = result;
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

const pegarReceitaCategoriaPorIdReceita = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    try {
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            let result = await receitaCategoriaDAO.getSelectReceitaCategoriaByReceitaId(id);

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status;
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code;
                    MESSAGE.HEADER.response.receita_categoria = result;
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

const pegarReceitaCategoriaPorCategoriaId = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    try {
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            let result = await receitaCategoriaDAO.getSelectReceitaCategoriaByCategoriaId(id);

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status;
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code;
                    MESSAGE.HEADER.response.receita_categoria = result;
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

const inserirReceitaCategoria = async function (receitaCategoria, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    try {
        if (String(contentType).toUpperCase() === 'APPLICATION/JSON') {
            let dadosInvalidos = validarDadosReceitaCategoria(receitaCategoria);
            if (!dadosInvalidos) {
                let result = await receitaCategoriaDAO.insertReceitaCategoria(receitaCategoria);
                if (result) {
                    let lastId = await receitaCategoriaDAO.getSelectLastIdReceitaCategoria();
                    if (lastId) {
                        receitaCategoria.id_receita_categoria = lastId;
                        MESSAGE.HEADER.status = MESSAGE.SUCCES_CREATED_ITEM.status;
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCES_CREATED_ITEM.status_code;
                        MESSAGE.HEADER.message = MESSAGE.SUCCES_CREATED_ITEM.message;
                        MESSAGE.HEADER.response = receitaCategoria;
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

const atualizarReceitaCategoria = async function (receitaCategoria, id, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    try {
        if (String(contentType).toUpperCase() === 'APPLICATION/JSON') {
            let dadosInvalidos = validarDadosReceitaCategoria(receitaCategoria);
            if (!dadosInvalidos) {
                let registroExistente = await pegarReceitaCategoriaPorId(id);
                if (registroExistente.status_code === 200) {
                    receitaCategoria.id_receita_categoria = parseInt(id);
                    let result = await receitaCategoriaDAO.setUpdateReceitaCategoria(receitaCategoria);
                    if (result) {
                        MESSAGE.HEADER.status = MESSAGE.SUCCES_UPDATE_ITEM.status;
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCES_UPDATE_ITEM.status_code;
                        MESSAGE.HEADER.message = MESSAGE.SUCCES_UPDATE_ITEM.message;
                        MESSAGE.HEADER.response = receitaCategoria;
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

const deletarReceitaCategoria = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    try {
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            let registroExistente = await pegarReceitaCategoriaPorId(id);
            if (registroExistente.status_code === 200) {
                let result = await receitaCategoriaDAO.setDeleteReceitaCategoria(parseInt(id));
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

const validarDadosReceitaCategoria = (receitaCategoria) => {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    if (!receitaCategoria.id_receita || isNaN(receitaCategoria.id_receita) || receitaCategoria.id_receita <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [id_receita] inválido";
        return MESSAGE.ERROR_REQUIRED_FIELDS; // 400
    } else if (!receitaCategoria.id_receita || isNaN(receitaCategoria.id_categoria) || receitaCategoria.id_categoria <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = "Atributo [id_categoria] inválido";
        return MESSAGE.ERROR_REQUIRED_FIELDS; // 400
    } else {
        return false; // Dados válidos
    }
};


module.exports = {
    listarReceitaCategoria,
    pegarReceitaCategoriaPorId,
    pegarReceitaCategoriaPorIdReceita,
    pegarReceitaCategoriaPorCategoriaId,
    inserirReceitaCategoria,
    atualizarReceitaCategoria,
    deletarReceitaCategoria,
    

}
