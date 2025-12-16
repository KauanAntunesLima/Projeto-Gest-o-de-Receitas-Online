/*************************************
 * Nome do programador: Gabriel Cavalcante dos Santos
 * Data: 05/12/2025
 * versão: 1.0
 * Objetivo: Arquivo responsavel pelarealização do CRUD no Banco de dados my sql da tabela de categorias
 ************************************/
//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../prisma/generated/prisma/index.js')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

const getSelectAllCategoria = async function () {
    try{

        let sql = `select * from tbl_categoria order by id_categoria desc`
        let result = await prisma.$queryRawUnsafe(sql)
   

        if (Array.isArray(result)){
            return result
        }
    }catch(error){
        return false
    }   
}

const getSelectByIdCategoria = async function (id) {
    try {
        const result = await prisma.$queryRaw`
            SELECT * FROM tbl_categoria WHERE id_categoria = ${id}`
        return result 
    } catch (error) {
        console.log(error)
        return false
    }
}

const setInsertCategoria = async function (categoria) {
    try{
        let sql = `insert into tbl_categoria(
        nome,
        descricao
        )
        values(
        '${categoria.nome}',
        '${categoria.descricao}')`

        let result = await prisma.$executeRawUnsafe(sql)
        if (result){
            return true
        }else{
            return false
        }

    }catch (error){
        return false
    }
    
}

const getSelectLastIdCategoria = async function (params){

    try {
        let sql = `select id_categoria from tbl_categoria order by id_categoria desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result)){
            return Number(result[0].id_categoria)
        }else{
            return false
        }
    } catch (error){
        return false
    }
}

const setUpdateCategoria = async function (categoria) {
    console.log(categoria)
    try{
        let sql = `update tbl_categoria set
        nome             = '${categoria.nome}',
        descricao        = '${categoria.descricao}'
        where id_categoria = ${categoria.id_categoria}`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return true
        }else{
            return false
        }
    }catch (error){
        return false
    }
}

const setDeleteCategoria = async function (id) {

    try {
        let sql = `DELETE FROM tbl_categoria where id_categoria = ${id}`

        //$executeRawUnsafe()  -> permite apenas executar scripts sql que não tem retorno de dados (INSERT, UPDATE, DELETE)
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

module.exports = {
    getSelectAllCategoria,
    getSelectByIdCategoria,
    setInsertCategoria,
    getSelectLastIdCategoria,
    setUpdateCategoria,
    setDeleteCategoria
}