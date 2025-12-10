/*************************************
 * Nome do programador: Gabriel Cavalcante dos Santos
 * Data: 26/11/2025
 * versão: 1.0
 * Objetivo: Arquivo responsavel pelarealização do CRUD no Banco de dados my sql da tabela de Usuarios
 ************************************/
//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

const getSelectAllUsuario = async function () {
    try{

        let sql = `select * from tbl_usuario order by id_usuario desc`
        let result = await prisma.$queryRawUnsafe(sql)
        console.log(result, "AAAAA")

        if (Array.isArray(result)){
            return result
        }
    }catch(error){
        return false
    }   
}

const getSelectByIdUsuario = async function (id) {

      try {
        const result = await prisma.$queryRaw`
            SELECT * FROM tbl_usuario WHERE id_usuario = ${id}`
        return result 
    } catch (error) {
        console.log(error)
        return false
    }  
    
}

const setInsertUsuario = async function (usuario) {

    try{

        let sql = `insert into tbl_usuario (
        nome,
        email,
        senha,
        imagem)
        values(
        '${usuario.nome}',
        '${usuario.email}',
        '${usuario.senha}',
        '${usuario.imagem}')`

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

const getSelectLastIdUsuario = async function (params){

    try {
        let sql = `select id_usuario from tbl_usuario order by id_usuario desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result)){
            return Number(result[0].id_usuario)
        }else{
            return false
        }
    } catch (error){
        return false
    }
}

const setUpdateUsuario = async function (usuario) {
   
    try{
        let sql = `update tbl_usuario set
        nome     = '${usuario.nome}', 
        email    = '${usuario.email}',
        senha    = '${usuario.senha}',
        imagem   = '${usuario.imagem}'

        where id_usuario = ${usuario.id_usuario}`

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

const setDeleteUsuario = async function (id) {

    try {
        let sql = `DELETE FROM tbl_usuario where id_usuario = ${id}`

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
    getSelectAllUsuario,
    getSelectByIdUsuario,
    getSelectLastIdUsuario,
    setInsertUsuario,
    setUpdateUsuario,
    setDeleteUsuario
}