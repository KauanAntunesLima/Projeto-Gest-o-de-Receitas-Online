/*************************************
 * Nome do programador: Gabriel Cavalcante dos Santos
 * Data: 26/11/2025
 * versão: 1.0
 * Objetivo: Arquivo responsavel pelarealização do CRUD no Banco de dados my sql da tabela de receitas
 ************************************/
//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../prisma/generated/prisma/index.js')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

const getSelectAllreceita = async function () {
    try{

        let sql = `select * from tbl_receita order by id_receita desc`
        let result = await prisma.$queryRawUnsafe(sql)
        console.log(result)
        if (Array.isArray(result)){
            return result
        }
    }catch(error){
        console.log(error)
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
        imagem)
        values(
        ${receita.id_usuario},
        '${receita.titulo}',
        '${receita.descricao}',
        ${receita.tempo_preparo},
        '${receita.dificuldade}',
        '${receita.data_criacao}',
        '${receita.imagem}')`

        let result = await prisma.$executeRawUnsafe(sql)
        console.log(result)
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
        
        if(result){
            return true
        }else{
            return false
        }
    }catch (error){
        console.log(error)
        return false
    }
    
}
const setDeleteReceita = async function (id) {
    try {

        if (!id || isNaN(id)) {
            return false
        }

        const result = await prisma.$executeRaw`
            DELETE FROM tbl_receita WHERE id_receita = ${Number(id)}
        `

        return result > 0

    } catch (error) {
        console.error('Erro ao deletar receita:', error)
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

        if (filtros.dificuldade && filtros.dificuldade.length > 0) {
            const dificuldadesString = filtros.dificuldade.map(d => `'${d}'`).join(',')
            where.push(`dificuldade IN (${dificuldadesString})`)
        }

        if (filtros.tipo && filtros.tipo.length > 0) {
            const tiposString = filtros.tipo.map(t => `'${t}'`).join(',')
            where.push(`tipo_cozinha IN (${tiposString})`)
        }

        if (filtros.ingredientes && filtros.ingredientes.length > 0) {
            const ingredientesConditions = filtros.ingredientes.map(ing => `ingredientes LIKE '%${ing.replace(/'/g, "''")}%'`)
            where.push(`(${ingredientesConditions.join(' OR ')})`)
        }

        if (filtros.categoria && filtros.categoria.length > 0) {
            const idsCategoria = filtros.categoria.map(cat => parseInt(cat)).filter(cat => !isNaN(cat))
            if (idsCategoria.length > 0) {
                where.push(`id_receita IN (
                    SELECT DISTINCT id_receita
                    FROM tbl_receita_categoria
                    WHERE id_categoria IN (${idsCategoria.join(',')})
                )`)
            }
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
        console.log(sql)
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)) {
            return result
        } else {
            return []
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

const getSelectReceitasByUsuario = async function (idUsuario) {
    try {
        let sql = `
            SELECT DISTINCT r.*
            FROM tbl_receita r
            WHERE r.id_usuario = ${idUsuario}
            ORDER BY r.data_criacao DESC
        `

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)) {
            return result
        } else {
            return []
        }
    } catch (error) {
        console.log('Erro ao buscar receitas do usuário:', error)
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
    getSelectReceitasComFiltrosView,
    getSelectReceitasByUsuario
}