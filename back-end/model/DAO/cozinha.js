/*************************************
 * Nome do programador: Kauan Antunes Lima
 * Data: 05/12/2025
 * versão: 1.0
 * Objetivo: Arquivo responsavel pelarealização do CRUD no Banco de dados my sql da tabela de cozinha
 ************************************/
//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../prisma/generated/prisma/index.js')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

const getSelectAllCozinha = async function () {
    try{

        let sql = `select * from tbl_cozinha order by id_cozinha desc`
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)){
            return result
        }
    }catch(error){
        return false
    }   
}

const getSelectByIdCozinha = async function (id) {
    try {
        const result = await prisma.$queryRaw`
            SELECT * FROM tbl_cozinha WHERE id_cozinha = ${id}
        `
        return result 
    } catch (error) {
        console.log(error)
        return false
    }
}

const setInsertCozinha = async function (cozinha){
    try{
        let sql = `insert into tbl_cozinha (
        nome)
        values(
        '${cozinha.nome}')`

        let result = await prisma.$executeRawUnsafe(sql)
        if (result){
            return true
        }else{
            return false
        }
    }catch(error){
        console.log(error)
        return false
    }
}

const getSelectLastIdCozinha = async function (params){

    try {
        let sql = `select id_cozinha from tbl_cozinha order by id_cozinha desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result)){
            return Number(result[0].id_cozinha)
        }else{
            return false
        }
    } catch (error){
        return false
    }
}

const setUpdateCozinha = async function (cozinha) {

    try{
        let sql = `update tbl_cozinha set
        nome             = '${cozinha.nome}'
        where id_cozinha = ${cozinha.id_cozinha}`

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

const setDeleteCozinha = async function (id) {

    try {
        let sql = `DELETE FROM tbl_cozinha where id_cozinha = ${id}`

        //$executeRawUnsafe()  -> permite apenas executar scripts sql que não tem retorno de dados (INSERT, UPDATE, DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log('Erro no UPDATE:', error)
        return false
    }
}


module.exports = {
    getSelectAllCozinha,
    getSelectByIdCozinha,
    setInsertCozinha,
    getSelectLastIdCozinha,
    setUpdateCozinha,
    setDeleteCozinha
}