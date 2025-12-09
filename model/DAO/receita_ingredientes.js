/*************************************
 * Nome do programador: Roger Ribeiro de Oliveira
 * Data: 08/12/2025
 * versão: 1.0
 * Objetivo: Arquivo responsavel pelarealização do CRUD no Banco de dados my sql da tabela relacional Ingrediente e receita
 ************************************/
const { PrismaClient } = require('../../generated/prisma')

const prisma = new PrismaClient()

const getSelectAllReceitaIngredientes = async function () {
    try {

        let sql = `select * from tbl_receita_ingredientes order by id_receita_ingredientes desc`
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)) {
            return result
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const getSelectReceitaIngredientesById = async function (id) {
    try {

        let sql = `select * from tbl_receita_ingredientes where id_receita_ingredientes=${id} order by id_receita_ingredientes desc`
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)) {
            return result
        }
    } catch (error) {
        return false
    }
}
const getSelectReceitaIngredientesByReceitaId = async function (id) {
    try {

        let sql = `select * from tbl_receita_ingredientes where id_receita=${id} order by id_receita_ingredientes desc`
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)) {
            return result
        }
    } catch (error) {
        return false
    }
}
const getSelectReceitaIngredientesByIngredienteId = async function (id) {
    try {

        let sql = `select * from tbl_receita_ingredientes where id_receita=${id} order by id_receita_ingredientes desc`
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)) {
            return result
        }
    } catch (error) {
        return false
    }
}

const insertReceitaIngredientes = async function (receitaIngrediente) {
    try {
        const sql = `
        INSERT INTO ingrediente_receita
                    (receita_id,
                     ingrediente_id,
                     quantidade,
                     unidade)
                VALUES (${receitaIngrediente.receita_id},
                        ${receitaIngrediente.ingrediente_id},
                        "${receitaIngrediente.quantidade}",
                        "${receitaIngrediente.unidade}")
    `

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return result
        else
            return false
    } catch (error) {
        return false
    }
}
const getSelectLastIdReceitaIngrediente = async function () {

    try {
        let sql = `select id_ingredientes from tbl_receita_ingredientes order by id_receita_ingredientes desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)) {
            return Number(result[0].id_ingredientes)
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}
const setUpdateReceitaIngredientes = async function (receitaIngredientes) {

    try {
        let sql = `UPDATE tbl_receita_ingredientes
                    SET
                        id_receita = ${receitaIngredientes.id_receita},
                        id_ingredientes = ${receitaIngredientes.id_ingredientes},
                        quantidade = ${receitaIngredientes.quantidade},
                        unidade = '${receitaIngredientes.unidade}'
                    WHERE
                        id_receita_ingredientes = ${receitaIngredientes.id_receita_ingredientes};
`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }

}
const setDeleteReceitaIngredientes = async function (id) {

    try {
        let sql = `DELETE FROM tbl_receita_ingredientes where id_receita_ingredientes = ${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {

        return false
    }

}

module.exports = {
    getSelectAllReceitaIngredientes,
    getSelectReceitaIngredientesById,
    getSelectReceitaIngredientesByIngredienteId,
    getSelectReceitaIngredientesByReceitaId,
    setUpdateReceitaIngredientes,
    setDeleteReceitaIngredientes,
    getSelectLastIdReceitaIngrediente,
    insertReceitaIngredientes
}