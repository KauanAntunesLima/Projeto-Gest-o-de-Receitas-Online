/*************************************
 * Nome do programador: Kauan Antunes
 * Data: 10/12/2025
 * versão: 1.0
 * Objetivo: Arquivo responsavel pelarealização do CRUD no Banco de dados my sql da tabela relacional Ingrediente e receita
 ************************************/
const { PrismaClient } = require('../../generated/prisma')

const prisma = new PrismaClient()

const getSelectAllReceitaCategoria = async function () {
    try {

        let sql = `select * from tbl_receita_categoria order by id_receita_categoria desc`
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

const getSelectReceitaCategoriaById = async function (id) {
    try {

        let sql = `select * from tbl_receita_categoria where id_receita_categoria=${id} order by id_receita_categoria desc`
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)) {
            return result
        }
    } catch (error) {
        return false
    }
}

const getSelectReceitaCategoriaByReceitaId = async function (id) {
    try {

        let sql = `select * from tbl_receita_categoria where id_receita=${id} order by id_receita_categoria desc`
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)) {
            return result
        }
    } catch (error) {
        return false
    }
}

const getSelectReceitaCategoriaByCategoriaId = async function (id) {
    try {

        let sql = `select * from tbl_receita_categoria where id_receita=${id} order by id_receita_categoria desc`
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)) {
            return result
        }
    } catch (error) {
        return false
    }
}

const insertReceitaCategoria = async function (receitaCategoria) {
    try {
        const sql = `
        INSERT INTO tbl_receita_categoria
                    (id_receita,
                     id_categoria)
                VALUES (${receitaCategoria.id_receita},
                        ${receitaCategoria.id_categoria})`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

const getSelectLastIdReceitaCategoria = async function () {

    try {
        let sql = `select id_categoria from tbl_receita_categoria order by id_receita_categoria desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)) {
            return Number(result[0].id_categoria)
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const setUpdateReceitaCategoria = async function (receitaCategoria) {

    try {
        let sql = `UPDATE tbl_receita_categoria
                    SET
                        id_receita = ${receitaCategoria.id_receita},
                        id_categoria = ${receitaCategoria.id_categoria}
                    WHERE
                        id_receita_categoria = ${receitaCategoria.id_receita_categoria};
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

const setDeleteReceitaCategoria = async function (id) {

    try {
        let sql = `DELETE FROM tbl_receita_categoria where id_receita_categoria = ${id}`

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
    getSelectAllReceitaCategoria,
    getSelectReceitaCategoriaById,
    getSelectReceitaCategoriaByReceitaId,
    getSelectReceitaCategoriaByCategoriaId,
    insertReceitaCategoria,
    getSelectLastIdReceitaCategoria,
    setUpdateReceitaCategoria,
    setDeleteReceitaCategoria
}
