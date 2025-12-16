/****************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entreo App e a Model 
 *           (validações, tratamento de dados, tratamento de errros, etc)
 * Data: 01/12/2025
 * Autor: Gabriel Cavalcante
 * Versão: 2.0
 ****************************************************************************************/
const receitaDAO = require('../model/DAO/receita.js')
const controllerReceitaCozinha = require('./controller_receita_cozinha.js')
const controllerCozinha = require('./controller_cozinha.js')
const controllerReceitaIngrediente = require('./controller_receita_ingredientes.js')
const controllerIngrediente = require('./controller_ingredientes.js')
const controllerIngredienteAlergenos = require('./controller_ingrediente_alergenos.js')
const controllerAlergenos = require('./controller_alergenos.js')
const controllerReceitaCategoria = require('./controller_receita_categoria.js')
const controllerCategoria = require('./controller_categoria.js')
const controllerModoPreparo = require('./controller_modo_preparo.js')
const controllerUsuarioNota = require('./controller_usuario_notas_receita.js')

const MESSAGE_DEFAULT = require('../modulo/config_messages.js')

const listarReceita = async function () {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let result = await receitaDAO.getSelectAllreceita()
        console.log(result)
        if (result && result.length > 0) {

            for (let receita of result) {

                let cozinhaId = await controllerReceitaCozinha.buscarCozinhaReceitaId(receita.id_receita)
                if (cozinhaId?.response?.receitaCozinha?.length > 0) {
                    let cozinha = await controllerCozinha.pegarIdCozinha(cozinhaId.response.receitaCozinha[0].id_cozinha)
                    receita.cozinha = cozinha.response.cozinha
                }

                let categoriaId = await controllerReceitaCategoria.pegarReceitaCategoriaPorIdReceita(receita.id_receita)
                if (categoriaId && categoriaId.response && categoriaId.response.receita_categoria && categoriaId.response.receita_categoria.length > 0) {
                    let categoria = await controllerCategoria.pegarIdCategoria(categoriaId.response.receita_categoria[0].id_categoria)
                    if (categoria && categoria.response && categoria.response.categoria) {
                        receita.categoria = categoria.response.categoria[0]
                    }
                }

                let receitaIngrediente = await controllerReceitaIngrediente.pegarReceitaIngredientePorIdReceita(receita.id_receita)

                receita.ingredientes = []
                receita.alergenos = []

                if (receitaIngrediente &&
                    receitaIngrediente.response &&
                    receitaIngrediente.response.receita_ingredientes) {

                    for (let id of receitaIngrediente.response.receita_ingredientes) {

                        let ingredienteAchado = await controllerIngrediente.pegarIdIngrediente(id.id_ingredientes)

                        if (ingredienteAchado?.response?.ingrediente) {

                            for (let ingrediente of ingredienteAchado.response.ingrediente) {

                                let novoIngrediente = {
                                    id_ingrediente: ingrediente.id_ingredientes,
                                    nome: ingrediente.nome,
                                    tipo: ingrediente.tipo,
                                    quantidade: id.quantidade,
                                    unidade: id.unidade
                                }

                                receita.ingredientes.push(novoIngrediente)

                                let ingredientesAlergenosDaReceita = await controllerIngredienteAlergenos.pegarIngredientesAlergenosPorIngredientesId(ingrediente.id_ingredientes)
                                if (ingredientesAlergenosDaReceita.length > 0)
                                    for (let alergeno of ingredientesAlergenosDaReceita.response.alergenos) {

                                        let alergenos = await controllerAlergenos.pegarIdAlergenos(alergeno.id_alergenos)

                                        for (let alergenoNome of alergenos.response.alergenos) {

                                            let alergenosAchado = {
                                                id_ingrediente: alergeno.id_ingredientes,
                                                ingrediente_nome: ingrediente.nome,
                                                alergeno: alergenoNome.nome
                                            }

                                            receita.alergenos.push(alergenosAchado)
                                        }
                                    }
                            }
                        }
                    }
                }
            }

            MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
            MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
            MESSAGE.HEADER.response.receita = result

            return MESSAGE.HEADER

        } else {
            return MESSAGE.ERROR_NOT_FOUND
        }

    } catch (error) {
        console.error(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}



const buscarReceitaPorNome = async function (nome) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação do nome
        if (nome != '' && nome != null && nome != undefined) {

            //Chama a função do DAO para buscar por nome
            let result = await receitaDAO.getSelectReceitaByNome(nome)

            if (result !== false) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.receitas = result
                    return MESSAGE.HEADER
                } else {
                    return MESSAGE.ERROR_NOT_FOUND
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [nome] inválido'
            return MESSAGE.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const filtrarReceitas = async function (filtrosRequest) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        // Tratar os filtros da requisição
        const filtros = {
            tempo_max: filtrosRequest.tempo_max ? Number(filtrosRequest.tempo_max) : undefined,
            dificuldade: filtrosRequest.dificuldade ? [].concat(filtrosRequest.dificuldade) : undefined,
            tipo: filtrosRequest.tipo ? [].concat(filtrosRequest.tipo) : undefined,
            categoria: filtrosRequest.categoria ? [].concat(filtrosRequest.categoria) : undefined,
            nome: filtrosRequest.nome || undefined,
            ingredientes: filtrosRequest.ingredientes ? [].concat(filtrosRequest.ingredientes) : undefined,
            alergenos: filtrosRequest.alergenos ? [].concat(filtrosRequest.alergenos) : undefined
        }

        let result = await receitaDAO.getSelectReceitasComFiltrosView(filtros)

        if (result !== false) {
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.receitas = result

                return MESSAGE.HEADER
            } else {
                return MESSAGE.ERROR_NOT_FOUND
            }
        } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const pegarIdReceita = async function (id) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        //Validação de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            let receitaAvaliacao = await controllerUsuarioNota.buscarUsuarioNotasReceitaId(id)

            if (receitaAvaliacao) {
                //Chama a função para filtrar pelo ID
                let result = await receitaDAO.getSelectByIdReceita(parseInt(id))

                if (result) {
                    if (result.length > 0) {

                        if (receitaAvaliacao.status_code === 200) {
                            let somaNotas = 0
                            let totalNotas = receitaAvaliacao.response.usuarioNotasReceita.length

                            receitaAvaliacao.response.usuarioNotasReceita.forEach(nota => {
                                
                                somaNotas += Number(nota.nota);
                            });

                            let mediaNotas = parseFloat((somaNotas / totalNotas).toFixed(1));
                            result[0].nota = mediaNotas;


                        } else if(receitaAvaliacao.status_code = 404) {
                            result[0].nota = 0;
                        }

                        let cozinhaId = await controllerReceitaCozinha.buscarCozinhaReceitaId(id)

                        if (cozinhaId) {
                            let cozinha = await controllerCozinha.pegarIdCozinha(cozinhaId.response.receitaCozinha[0].id_cozinha)

                            if (cozinha) {
                                result[0].cozinha = cozinha.response.cozinha

                                let categoriaId = await controllerReceitaCategoria.pegarReceitaCategoriaPorIdReceita(id)
                                if (categoriaId && categoriaId.response && categoriaId.response.receita_categoria && categoriaId.response.receita_categoria.length > 0) {
                                    let categoria = await controllerCategoria.pegarIdCategoria(categoriaId.response.receita_categoria[0].id_categoria)
                                    if (categoria && categoria.response && categoria.response.categoria) {
                                        result[0].categoria = categoria.response.categoria[0]
                                    }
                                }

                                let infoIngredienteDaReceita = await controllerReceitaIngrediente.pegarReceitaIngredientePorIdReceita(id)
                                if (infoIngredienteDaReceita) {

                                    result[0].ingredientes = []
                                    result[0].alergenos = []
                                    result[0].modo_preparo = []

                                    let modoDePreparo = await controllerModoPreparo.pegarModoPreparoPorIdReceita(result[0].id_receita)

                                    for (let modo_preparo of modoDePreparo.response.modo_preparo) {

                                        let preparo = {
                                            numero_passo: modo_preparo.numero_passo,
                                            descricao: modo_preparo.descricao

                                        }

                                        result[0].modo_preparo.push(preparo)

                                    }
                                    for (id of infoIngredienteDaReceita.response.receita_ingredientes) {

                                        let ingredienteAchado = await controllerIngrediente.pegarIdIngrediente(id.id_ingredientes)
                                        if (ingredienteAchado) {

                                            for (let ingrediente of ingredienteAchado.response.ingrediente) {

                                                let novoIngrediente = {
                                                    id_ingrediente: ingrediente.id_ingredientes,
                                                    nome: ingrediente.nome,
                                                    tipo: ingrediente.tipo,
                                                    quantidade: id.quantidade,
                                                    unidade: id.unidade
                                                }
                                                let ingredientesAlergenosDaReceita = await controllerIngredienteAlergenos.pegarIngredientesAlergenosPorIngredientesId(ingrediente.id_ingredientes)
                                                if (ingredientesAlergenosDaReceita > 0)
                                                    for (let alergeno of ingredientesAlergenosDaReceita.response.alergenos) {

                                                        let alergenos = await controllerAlergenos.pegarIdAlergenos(alergeno.id_alergenos)

                                                        for (let alergenoNome of alergenos.response.alergenos) {

                                                            let alergenosAchado = {
                                                                id_ingrediente: alergeno.id_ingredientes,
                                                                ingrediente_nome: ingrediente.nome,
                                                                alergeno: alergenoNome.nome
                                                            }

                                                            result[0].alergenos.push(alergenosAchado)
                                                        }
                                                    }

                                                result[0].ingredientes.push(novoIngrediente)
                                            }
                                        } else {
                                            return ingredienteAchado
                                        }

                                    }

                                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                                    MESSAGE.HEADER.response.receita = result

                                    return MESSAGE.HEADER //200
                                } else {
                                    return data
                                }
                            } else {
                                return cozinha
                            }
                        } else {
                            return cozinhaId
                        }
                    } else {
                        return MESSAGE.ERROR_NOT_FOUND //404
                    }

                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            } else {
                return receitaAvaliacao
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

const atualizarReceita = async function (receita, id, contentType) {
    const currentDate = new Date().toISOString().split('T')[0];
    receita.data_edicao = currentDate;
    receita.id_receita = parseInt(id);

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //validção do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosReceita(receita)

            if (!validarDados) {

                //chama a função para validar a consistencia do id e verificar se existe no banco de dados
                let validarId = await pegarIdReceita(id)


                //verifica se o id existe no BD, caso exista teremos o status 200
                if (validarId.status_code == 200) {

                    //Chama a função do DAO para atualizar um novo filme
                    let result = await receitaDAO.setUpdateReceita(receita)

                    if (result) {

                        try {
                            // Atualizar/inserir cozinha
                            if (receita.id_cozinha) {
                                await controllerReceitaCozinha.inserirReceitaCozinha({
                                    id_receita: parseInt(id),
                                    id_cozinha: receita.id_cozinha
                                }, 'application/json');
                            }

                            // Atualizar/inserir categoria
                            if (receita.id_categoria) {
                                await controllerReceitaCategoria.inserirReceitaCategoria({
                                    id_receita: parseInt(id),
                                    id_categoria: receita.id_categoria
                                }, 'application/json');
                            }

                            // Inserir ingredientes
                            if (receita.ingredientes && Array.isArray(receita.ingredientes)) {
                                for (let i = 0; i < receita.ingredientes.length; i++) {
                                    let ingrediente = receita.ingredientes[i];
                                    if (ingrediente.id_ingredientes) {
                                        await controllerReceitaIngrediente.inserirReceitaIngrediente({
                                            id_receita: parseInt(id),
                                            id_ingrediente: ingrediente.id_ingredientes,
                                            quantidade: ingrediente.quantidade || '',
                                            unidade: ingrediente.unidade || ''
                                        }, 'application/json');
                                    }
                                }
                            }

                            // Inserir modo de preparo
                            if (receita.modo_preparo && Array.isArray(receita.modo_preparo)) {
                                // Ordenar por número do passo
                                let modoPreparoOrdenado = receita.modo_preparo.sort((a, b) => a.numero_passo - b.numero_passo);

                                for (let i = 0; i < modoPreparoOrdenado.length; i++) {
                                    let modoPreparo = modoPreparoOrdenado[i];
                                    if (modoPreparo.numero_passo && modoPreparo.descricao) {
                                        await controllerModoPreparo.inserirModoPreparo({
                                            id_receita: parseInt(id),
                                            numero_passo: modoPreparo.numero_passo,
                                            descricao: modoPreparo.descricao
                                        }, 'application/json');
                                    }
                                }
                            }

                        } catch (relacionamentoError) {
                            console.log('ERRO ao atualizar relacionamentos:', relacionamentoError.message);
                        }

                        MESSAGE.HEADER.status = MESSAGE.SUCCES_UPDATE_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCES_UPDATE_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCES_UPDATE_ITEM.message
                        MESSAGE.HEADER.response = receita

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

const inserirReceita = async function (receita, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let dadosValidos = await validarDadosReceita(receita)

            if (!dadosValidos) {

                let novaReceita = {
                    id_usuario: receita.id_usuario,
                    titulo: receita.titulo,
                    descricao: receita.descricao,
                    tempo_preparo: receita.tempo_preparo,
                    dificuldade: receita.dificuldade,
                    data_criacao: receita.data_criacao,
                    imagem: receita.imagem
                }

                let result = await receitaDAO.setInsertReceita(novaReceita)
                if (result) {
                    let lastIdReceita = await receitaDAO.getSelectLastIdReceita()

                    if (lastIdReceita) {


                        await controllerReceitaCozinha.inserirReceitaCozinha({
                            id_receita: lastIdReceita,
                            id_cozinha: receita.id_cozinha
                        }, 'application/json')

                        await controllerReceitaCategoria.inserirReceitaCategoria({
                            id_receita: lastIdReceita,
                            id_categoria: receita.id_categoria
                        }, 'application/json')


                        for (let ingrediente of receita.ingredientes) {

                            let receitaIngredienteList = {
                                id_receita: lastIdReceita,
                                id_ingrediente: ingrediente.id_ingredientes,
                                quantidade: ingrediente.quantidade,
                                unidade: ingrediente.unidade
                            }

                            await controllerReceitaIngrediente.inserirReceitaIngrediente(receitaIngredienteList, 'application/json')
                        }
                        for (let modoPreparo of receita.modo_preparo) {

                            let modoPreparoList = {
                                id_receita: lastIdReceita,
                                numero_passo: modoPreparo.numero_passo,
                                descricao: modoPreparo.descricao
                            }

                            await controllerModoPreparo.inserirModoPreparo(modoPreparoList, 'application/json')

                        }
                        /*   for (let avaliacao of receita.avaliacao){
                              let notasList = {
                                  id_usuario: avaliacao.id_usuario,
                                  id_receita: avaliacao.id_receita,
                                  nota: avaliacao.nota,
                                  descricao: avaliacao.descricao
                              }
                              await controllerUsuarioNota.inserirUsuarioNotasReceita(notasList, 'application/json')
                          } */

                        //adiciona no Json de filme o ID que foi gerado no BD
                        receita.id = lastIdReceita
                        MESSAGE.HEADER.status = MESSAGE.SUCCES_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCES_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCES_CREATED_ITEM.message
                        MESSAGE.HEADER.response = receita


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

const deletarReceita = async function (id) {

    //apaga um filme filtrando pelo id
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (id != '' && id != null && id != undefined && !isNaN(id)) {

            let excluirReceita = await pegarIdReceita(id)

            if (excluirReceita.status_code == 200) {


                let result = await receitaDAO.setDeleteReceita(parseInt(id))

                if (result) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETE_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETE_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETE_ITEM.message


                    return MESSAGE.HEADER
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            } else {
                return excluirReceita
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS // 400
        }
    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
    }
}

const validarDadosReceita = async function (receita) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (receita.id_usuario == '' || receita.id_usuario == null || receita.id_usuario == undefined || isNaN(receita.id_usuario) || receita.id_usuario <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_USUARIO] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    } else if (receita.titulo == '' || receita.titulo == null || receita.titulo == undefined || receita.titulo.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [Receita] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    } else if (receita.descricao == '' || receita.descricao == null || receita.descricao == undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [Descrição] invalido'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    } else if (receita.tempo_preparo == '' || receita.tempo_preparo == null || receita.tempo_preparo == undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [tempo] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    } else if (receita.dificuldade == '' || receita.dificuldade == null || receita.dificuldade == undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [dificuldade] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    } else if (receita.data_criacao == '' || receita.data_criacao == null || receita.data_criacao == undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [data_criacao] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS


    } else if (receita.imagem == '' || receita.imagem == null || receita.imagem == undefined || receita.imagem.length > 255) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [imagem] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    }
}
const listarReceitasPorUsuario = async function (idUsuario) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (idUsuario != '' && idUsuario != null && idUsuario != undefined && !isNaN(idUsuario) && idUsuario > 0) {
            let result = await receitaDAO.getSelectReceitasByUsuario(parseInt(idUsuario))

            if (result !== false) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.receitas = result
                    return MESSAGE.HEADER
                } else {
                    return MESSAGE.ERROR_NOT_FOUND
                }
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_USUARIO] inválido'
            return MESSAGE.ERROR_REQUIRED_FIELDS
        }
    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    listarReceita,
    pegarIdReceita,
    inserirReceita,
    atualizarReceita,
    deletarReceita,
    filtrarReceitas,
    buscarReceitaPorNome,
    listarReceitasPorUsuario
}