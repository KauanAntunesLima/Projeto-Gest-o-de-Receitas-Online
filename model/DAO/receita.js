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
        id_usuario,
        titulo,
        descricao,
        tempo_preparo,
        dificuldade,
        data_criacao,
        data_edicao,
        imagem)
        values(
        ${receita.id_usuario},
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

    try{
        let sql = `update tbl_receita set
        id_usuario      =  ${receita.id_usuario},
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

// Buscar receitas por nome usando LIKE
const getSelectReceitaByNome = async function (nome) {
    try {
        let sql = `
            SELECT DISTINCT r.*
            FROM tbl_receita r
            WHERE r.titulo LIKE '%${nome}%'
            ORDER BY r.titulo ASC
        `

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result) && result.length > 0) {
            return result
        } else {
            return []
        }
    } catch (error) {
        console.log('Erro ao buscar receita por nome:', error)
        return false
    }
}


const getSelectReceitasComFiltrosView = async function (filtros) {
    try {
        const where = []

        if (filtros.tempo_max) {
            where.push(`tempo_preparo <= ${filtros.tempo_max}`)
        }

        if (filtros.dificuldade) {
            where.push(`dificuldade = '${filtros.dificuldade}'`)
        }

        if (filtros.tipo && filtros.tipo.length > 0) {
            const tiposString = filtros.tipo.map(t => `'${t}'`).join(',')
            where.push(`tipo_cozinha IN (${tiposString})`)
        }

        if (filtros.categoria && filtros.categoria.length > 0) {
            const categoriasString = filtros.categoria.map(cat => {
                return `'${cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}'`
            }).join(',')
            where.push(`categoria IN (${categoriasString})`)
        }

        if (filtros.nome) {
            where.push(`titulo LIKE '%${filtros.nome}%'`)
        }

        if (filtros.alergenos && filtros.alergenos.length > 0) {
            const alergenosString = filtros.alergenos.map(alergeno => `'${alergeno}'`).join(',')
            where.push(`id_receita NOT IN (
                SELECT DISTINCT id_receita
                FROM vw_alergenos_por_ingredientes
                WHERE nome_alergeno IN (${alergenosString})
            )`)
        }

        let sql = `SELECT DISTINCT *
FROM vw_receitas_completas`

        if (where.length > 0) {
            sql += `\nWHERE ${where.join('\n  AND ')}`
        }

        sql += `\nORDER BY titulo ASC`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)) {
            return result
        } else {
            return []
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
    setDeleteReceita,
    getSelectReceitaByNome,
    getSelectReceitasComFiltrosView
}