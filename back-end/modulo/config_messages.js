/****************************************************************************************
 * Objetivo: Arquivo responsável pela padronização de todas as mensagens da api do projeto de Gestão de receitas
 * Data: 26/11/2025
 * Autor: Gabriel Cavalcante dos Santos
 * Versão: 1.0
 ****************************************************************************************/

const dataAtual = new Date()

/**************************MENSAGENS DE PADRONIZAÇÃO DO PROJETO**************************/
const HEADER = {
    development: 'Gabriel Cavalcante dos Santos',
    api_description: 'API para manipular dados do Projeto de Gestão de Receitas',
    version: '1.0.10.25',
    request_date: dataAtual.toLocaleDateString(),
    status: Boolean,
    status_code: Number,
    response: {}
}

/**************************MESAGENS DE ERRO DO PROJETO***********************************/
    const ERROR_NOT_FOUND                   =       { status: false, status_code: 404, message: 'não foram encontrados dados de retorno' }
    const ERROR_INTERNAL_SERVER_MODEL        =       { status: false, status_code: 500, message: 'não possivel processar a requisição devido a problemas na camada de MODELAGEM de dados !!!' }
    const ERROR_INTERNAL_SERVER_CONTROLLER   =       { status: false, status_code: 500, message: 'não possivel processar a requisição devido a problemas na camada de CONTROLE de Banco de Dados !!!' }
    const ERROR_REQUIRED_FIELDS             =       { status: false, status_code: 400, message: 'Não foi possivel processar a requisição devido a atributos obrigatórios que não foram enviados corretamente, conforme a documentação da API !!!' }
    const ERROR_CONTENT_TYPE                =       { status: false, status_code: 415, message: 'Não foi possível processar a requisição pois o tipo de conteúdo enviado no BODY não e permitido. Deve-se utilizar apenas JSON na API !!' }
    const ERROR_RELATION_TABLE              =       { status: false, status_code: 200, message: 'A requisição foi bem sucedida, na criação do item principal, porem houveram problemas na tabela de relacionamento !!!'}

/**************************MENSAGENS DE SUCESSO DO PROJETO*******************************/
const SUCCESS_REQUEST = { status: true, status_code: 200, message: 'Requisição bem Sucedida!' }
const SUCCES_CREATED_ITEM = { status: true, status_code: 201, message: 'Objeto criado!' }
const SUCCES_UPDATE_ITEM = {status: true, status_code: 200, message: 'Requisição feita com sucesso, item atualizado com sucesso'}
const SUCCESS_DELETE_ITEM = {status: true, status_code: 202, message: 'Delete bem sucedido'}

module.exports = {
                    HEADER,
                    SUCCESS_REQUEST,
                    ERROR_INTERNAL_SERVER_MODEL,
                    ERROR_INTERNAL_SERVER_CONTROLLER,
                    ERROR_RELATION_TABLE,
                    ERROR_NOT_FOUND,
                    ERROR_REQUIRED_FIELDS,
                    SUCCES_CREATED_ITEM,
                    ERROR_CONTENT_TYPE,
                    SUCCES_UPDATE_ITEM,
                    SUCCESS_DELETE_ITEM
}