/*************************************
 * Nome do programador: Gabriel Cavalcante dos Santos
 * Data: 08/12/2025
 * versão: 1.0
 * Objetivo: Arquivo responsavel pelarealização do CRUD no Banco de dados my sql da tabela relacional usuario_notas_receita
 ************************************/
const { PrismaClient } = require('../../generated/prisma')

const prisma = new PrismaClient()

const getSelectAllUsuarioNotasReceita = async function () {
    try {

        let sql = `select * from tbl_usuario_notas_receita order by id_usuario_notas_receita desc`
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

const getSelectByIdUsuarioNotasReceita = async function (id) {
    try {

        let sql = `select * from tbl_usuario_notas_receita where id_usuario_notas_receita=${id} order by id_usuario_notas_receita desc`
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)) {
            return result
        }
    } catch (error) {
        return false
    }
}

const getSelectUsuarioNotasReceitaByUsuarioId = async function (id) {
    try {

        let sql = `select * from tbl_usuario_notas_receita where id_usuario=${id} order by id_usuario_notas_receita desc`
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)) {
            return result
        }
    } catch (error) {
        return false
    }
}

const setinsertUsuarioNotasReceita = async function (usuarioNotasReceita) {
    try {
        const sql = `
        INSERT INTO tbl_usuario_notas_receita
                    (id_usuario,
                     id_receita,
                     nota,
                     descricao)
                VALUES (${usuarioNotasReceita.id_usuario},
                        ${usuarioNotasReceita.id_receita},
                        "${usuarioNotasReceita.nota}",
                        "${usuarioNotasReceita.descricao}")
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

const getSelectLastIdUsuarioNotasReceita = async function () {

    try {
        let sql = `select id_usuario_notas_receita from tbl_usuario_notas_receita order by id_usuario_notas_receita desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)) {
            return Number(result[0].id_usuario_notas_ingrediente)
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const setUpdateUsuarioNotasReceita = async function (usuarioNotasReceita) {

    try {
        let sql = `UPDATE tbl_usuario_notas_receita
                    SET
                        id_usuario = ${usuarioNotasReceita.id_usuario},
                        id_receita = ${usuarioNotasReceita.id_receita},
                        nota = '${usuarioNotasReceita.nota}',
                        descricao = '${usuarioNotasReceita.descricao}'
                    WHERE
                        id_usuario_notas_receita = ${usuarioNotasReceita.id_notas_receita};
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

const setDeleteUsuarioNotasReceita = async function (id) {

    try {
        let sql = `DELETE FROM tbl_usuario_notas_receita where id_usuario_notas_receita = ${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {

        return false
    }

}
const setDeleteByIdUsuarioAndReceitaId = async function (idReceita){
    try{
        let sql = `DELETE FROM tbl_usuario_notas_receita WHERE id_receita=${idReceita}`

        let result = await prisma.$executeRawUnsafe(sql)

if(result){
    return true
}else{
    return false
}

    }catch(error){
        return false 
    }
}

module.exports = {
    getSelectAllUsuarioNotasReceita,
    getSelectByIdUsuarioNotasReceita,
    getSelectUsuarioNotasReceitaByUsuarioId,
    setinsertUsuarioNotasReceita,
    setUpdateUsuarioNotasReceita,
    setDeleteUsuarioNotasReceita,
    getSelectLastIdUsuarioNotasReceita,
    setDeleteByIdUsuarioAndReceitaId
}