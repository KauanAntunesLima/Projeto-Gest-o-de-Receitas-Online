/*************************************
 * Nome do programador: Gabriel Cavalcante dos Santos
 * Data: 26/11/2025
 * versão: 1.0
 * Objetivo: Arquivo responsavel pelarealização do CRUD no Banco de dados my sql da tabela de alergenos
 ************************************/
//import da biblioteca
const { PrismaClient } = require('../../generated/prisma')

const prisma = new PrismaClient()

const getSelectAllIngredientes = async function () {
    try{

        let sql = `select * from tbl_ingredientes order by id_ingredientes desc`
        let result = await prisma.$queryRawUnsafe(sql)
        
        if (Array.isArray(result)){
            return result
        }
    }catch(error){
        return false
    }   
}

const getSelectByIdIngredientes = async function (id) {
    
    try {
        const result = await prisma.$queryRaw`
            SELECT * FROM tbl_ingredientes WHERE id_ingredientes = ${id}`
        return result 
    } catch (error) {
        console.log(error)
        return false
    }
}

const setInsertReceita = async function (ingredientes){
    try{
        let sql = `insert into tbl_ingredientes (
        nome,
        tipo
        )
        values('${ingredientes.nome}',
                '${ingredientes.tipo}')`

        let result = await prisma.$executeRawUnsafe(sql)
        if (result){
            return true
        }else{
            return false
        }
    }catch(error){
        return false
    }
}

const getSelectLastIdIngrediente = async function (params){

    try {
        let sql = `select id_ingredientes from tbl_ingredientes order by id_ingredientes desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result)){
            return Number(result[0].id_ingredientes)
        }else{
            return false
        }
    } catch (error){
        return false
    }
}

const setUpdateIngredientes = async function (ingredientes) {

    try{
        let sql = `update tbl_ingredientes set
        nome          = '${ingredientes.nome}',
        tipo          = '${ingredientes.tipo}'
    
        where id_ingredientes = ${ingredientes.id_ingredientes}`

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

const setDeleteIngredientes = async function (id) {

    try {
        let sql = `DELETE FROM tbl_ingredientes where id_ingredientes = ${id}`

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
    getSelectAllIngredientes,
    getSelectByIdIngredientes,
    setInsertReceita,
    getSelectLastIdIngrediente,
    setUpdateIngredientes,
    setDeleteIngredientes
}


