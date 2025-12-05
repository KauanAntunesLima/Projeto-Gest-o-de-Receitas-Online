/*************************************
 * Nome do programador: Gabriel Cavalcante dos Santos
 * Data: 26/11/2025
 * versão: 1.0
 * Objetivo: Arquivo responsavel pelarealização do CRUD no Banco de dados my sql da tabela de alergenos
 ************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

const getSelectAllAlergenos = async function () {

    try{

        let sql = `select * from tbl_alergenos order by id_alergenos desc`
        let result = await prisma.$queryRawUnsafe(sql)
    
        if (Array.isArray(result)){
            return result
        }
    }catch(error){
        console.log(error)
        return false
    }   
}

const getSelectByIdAlergenos = async function (id) {
    try {
        let sql = `select * from tbl_alergenos where id_alergenos=${id}`
        let result = await prisma.$queryRawUnsafe(sql)
    
        if (Array.isArray(result)){
            return result
        }else{
            return false
        }
    }catch(error){
        return false
    }
}

const setInsertAlergenos = async function (alergenos) {
    try{
        let sql = `insert into tbl_alergenos(
        nome,
        descricao
        )
        values(
        '${alergenos.nome}',
        '${alergenos.descricao}')`

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

const getSelectLastIdAlergenos = async function (params){

    try {
        let sql = `select id_alergenos from tbl_alergenos order by id_alergenos desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result)){
            return Number(result[0].id_alergenos)
        }else{
            return false
        }
    } catch (error){
        return false
    }
}
    
const setUpdateAlergenos = async function (alergenos) {

    try{
        let sql = `update tbl_alergenos set
        nome     = '${alergenos.nome}',
        descricao          = '${alergenos.descricao}'

        where id_alergenos = ${alergenos.id_alergenos}`

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

const setDeleteAlergenos = async function (id) {

    try {
        let sql = `DELETE FROM tbl_alergenos where id_alergenos = ${id}`

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
    getSelectAllAlergenos,
    getSelectByIdAlergenos,
    setInsertAlergenos,
    setUpdateAlergenos,
    getSelectLastIdAlergenos,
    setDeleteAlergenos
}