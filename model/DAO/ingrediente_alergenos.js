/*************************************
 * Nome do programador: Roger Ribeiro de Oliveira
 * Data: 08/12/2025
 * versão: 1.0
 * Objetivo: Arquivo responsável pela realização do CRUD no Banco de dados my sql da tabela relacional Ingrediente e receita
 ************************************/
const { PrismaClient } = require('../../generated/prisma')

const prisma = new PrismaClient()

const getSelectAllIngredientesAlergenos = async function () {
    try {

        let sql = `select * from tbl_ingredientes_alergenos order by id_ingredientes_alergenos desc`
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

const getSelectIngredienteAlergenosById = async function (id) {
    try {

        let sql = `select * from tbl_ingredientes_alergeno where id_ingrediente_alergenos=${id} order by id_ingredientes_alergenos desc`
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)) {
            return result
        }
    } catch (error) {
        return false
    }
}

const getSelectIngredienteAlergenosByIngredienteId = async function (id) {
    try {

        let sql = `select * from tbl_ingredientes_alergenos where id_ingredientes=${id} order by id_ingredientes_alergenos desc`
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)) {
            return result
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

const insertIngredienteAlergenos = async function (ingredienteAlergeno) {
    try {
        const sql = `
        INSERT INTO tbl_ingredientes_alergenos
                    (receita_id,
                     ingrediente_id,
                     quantidade,
                     unidade)
                VALUES (${ingredienteAlergeno.receita_id},
                        ${ingredienteAlergeno.ingrediente_id},
                        "${ingredienteAlergeno.quantidade}",
                        "${ingredienteAlergeno.unidade}")
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
        let sql = `select id_ingredientes_alergenos from tbl_ingredientes_alergenos order by id_ingredientes_alergenos desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)) {
            return Number(result[0].id_ingrediente_alergenos)
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}
const setUpdateIngredienteAlergenos = async function (ingredienteAlergenos) {

    try {
        let sql = `UPDATE tbl_ingredientes_alergenos
                    SET
                        id_receita = ${ingredienteAlergenos.id_receita},
                        id_ingredientes_alergenos = ${ingredienteAlergenos.id_ingrediente_alergenos},
                        quantidade = ${ingredienteAlergenos.quantidade},
                        unidade = '${ingredienteAlergenos.unidade}'
                    WHERE
                        id_ingredientes_alergenos = ${ingredienteAlergenos.id_ingrediente_alergenos};
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
const setDeleteIngredienteAlergenos = async function (id) {

    try {
        let sql = `DELETE FROM tbl_ingredientes_alergeno where id_ingrediente_alergenos = ${id}`

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
    getSelectAllIngredientesAlergenos,
    getSelectIngredienteAlergenosById,
    getSelectIngredienteAlergenosByIngredienteId,
    setUpdateIngredienteAlergenos,
    setDeleteIngredienteAlergenos,
    getSelectLastIdReceitaIngrediente,
    insertIngredienteAlergenos
}