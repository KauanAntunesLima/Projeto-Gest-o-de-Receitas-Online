/*************************************
 * Nome do programador: Gabriel Cavalcante dos Santos
 * Data: 07/12/2025
 * versão: 1.0
 * Objetivo: Arquivo responsavel pelarealização do CRUD no Banco de dados my sql da tabela de modo_preparo
 ************************************/
//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

const getSelectAllModoPreparo = async function () {
    try {

        let sql = `select * from tbl_modo_preparo order by id_modo_preparo desc`
        let result = await prisma.$queryRawUnsafe(sql)
        console.log(result, "AAAAA")

        if (Array.isArray(result)) {
            return result
        }
    } catch (error) {
        return false
    }
}

const getSelectByIdModoPreparo = async function (id) {
    try {
        const result = await prisma.$queryRaw`
            SELECT * FROM tbl_modo_preparo WHERE id_modo_preparo = ${id}
        `
        return result
    } catch (error) {
        console.log(error)
        return false
    }
}
const getSelectModoPreparoByIdReceita = async function (id) {
    try {
        const result = await prisma.$queryRaw`
            SELECT * FROM tbl_modo_preparo WHERE id_receita = ${id}
        `
        return result
    } catch (error) {
        console.log(error)
        return false
    }
}

const getSelectLastIdModoPreparo = async function (params) {

    try {
        let sql = `select id_modo_preparo from tbl_modo_preparo order by id_modo_preparo desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)) {
            return Number(result[0].id_modo_preparo)
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const setInsertModoPreparo = async function (modo_preparo) {

    try {
        let sql = `insert into tbl_modo_preparo(
        id_receita,
        numero_passo,
        descricao)
        values(
        ${modo_preparo.id_receita},
        ${modo_preparo.numero_passo},
        '${modo_preparo.descricao}')`

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



const setUpdateModoPreparo = async function (modo_preparo) {
    try {
        let sql = `
            UPDATE tbl_modo_preparo SET
                numero_passo   = ${modo_preparo.numero_passo},
                descricao      = '${modo_preparo.descricao}',
                id_receita     = ${modo_preparo.id_receita}
            WHERE id_modo_preparo = ${modo_preparo.id_modo_preparo};
        `

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        } else {
            return false
        }

    } catch (error) {
        console.log(error)
        return false
    }
}

const setDeleteModoPreparo = async function (id) {
    try {
        const result = await prisma.$executeRaw`
            DELETE FROM tbl_modo_preparo WHERE id_modo_preparo = ${id}
        `;

        return result > 0
    } catch (error) {
        console.log(error)
        return false
    }
};


module.exports = {
    getSelectAllModoPreparo,
    getSelectByIdModoPreparo,
    getSelectLastIdModoPreparo,
    getSelectModoPreparoByIdReceita,
    setUpdateModoPreparo,
    setInsertModoPreparo,
    setDeleteModoPreparo
}