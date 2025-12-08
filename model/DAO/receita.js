/*************************************
 * Nome do programador: Gabriel Cavalcante dos Santos
 * Data: 26/11/2025
 * versão: 1.0
 * Objetivo: Arquivo responsavel pelarealização do CRUD no Banco de dados my sql da tabela de receitas
 ************************************/
//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

const getSelectAllreceita = async function () {
    try{

        let sql = `select * from tbl_receita order by id_receita desc`
        let result = await prisma.$queryRawUnsafe(sql)
        console.log(result, "AAAAA")

        if (Array.isArray(result)){
            return result
        }
    }catch(error){
        return false
    }   
}

const getSelectByIdReceita = async function (id) {
    try {
        const result = await prisma.$queryRaw`
            SELECT * FROM tbl_receita WHERE id_receita = ${id}
        `
        return result 
    } catch (error) {
        console.log(error)
        return false
    }
}


const setInsertReceita = async function (receita){

    try{
        let sql = `insert into tbl_receita (
        titulo,
        descricao,
        tempo_preparo,
        dificuldade,
        data_criacao,
        data_edicao,
        imagem)
        values(
        '${receita.titulo}',
        '${receita.descricao}',
        ${receita.tempo_preparo},
        '${receita.dificuldade}',
        '${receita.data_criacao}',
        '${receita.data_edicao}',
        '${receita.imagem}')`

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

const getSelectLastIdReceita = async function (params){

    try {
        let sql = `select id_receita from tbl_receita order by id_receita desc limit 1`

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result)){
            return Number(result[0].id_receita)
        }else{
            return false
        }
    } catch (error){
        return false
    }
}

const setUpdateReceita = async function (receita) {
    console.log(receita)
    try{
        let sql = `update tbl_receita set
        titulo          = '${receita.titulo}',
        descricao       = '${receita.descricao}',
        tempo_preparo   =  ${receita.tempo_preparo},
        dificuldade     = '${receita.dificuldade}', 
        data_criacao    = '${receita.data_criacao}',
        data_edicao     = '${receita.data_edicao}',
        imagem          = '${receita.imagem}'
        where id_receita = ${receita.id_receita}`

        let result = await prisma.$executeRawUnsafe(sql)
        console.log(result)
        if(result){
            return true
        }else{
            return false
        }
    }catch (error){
        return false
    }
    
}
const setDeleteReceita = async function (id) {

    try {
        let sql = `DELETE FROM tbl_receita where id_receita = ${id}`

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
    getSelectAllreceita,
    getSelectByIdReceita,
    getSelectLastIdReceita,
    setInsertReceita,
    setUpdateReceita,
    setDeleteReceita
}