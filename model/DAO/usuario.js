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
