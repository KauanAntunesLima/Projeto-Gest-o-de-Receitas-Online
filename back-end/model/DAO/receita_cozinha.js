/*************************************
 * Nome do programador: Gabriel Cavalcante dos Santos
 * Data: 08/12/2025
 * versão: 1.0
 * Objetivo: Arquivo responsavel pelarealização do CRUD no Banco de dados my sql da tabela relacional receita_cozinha
 ************************************/

const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

// Pegar os generos de todos os filmes e generos do banco de dados
const getSelectAllReceitaCozinha = async function (params) {
    try{
        let sql = `select * from tbl_receita_cozinha order by id_receita_cozinha desc`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)){
            return result
        }else{
            return false
        }
    } catch (error){
        console.log(error)
        return false
    }
    
}

const getSelectBYIdReceitaCozinha = async function (id) {
    try{
        let sql = `select * from tbl_receita_cozinha where id_receita=${id}`
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)) {
            return result
        } else {
            return false
        }

    } catch (error) {
        console.log(error) //usar para achar o erro, se a API retornar erro 500, caso o erro for no banco de dados (se vira pra resolver kkkk)
        return false
    }
    }

const getSelectLastIdReceitaCozinha = async function () {
    try {
     
   
      const sql = `SELECT id_receita_cozinha FROM tbl_receita_cozinha ORDER BY id_receita_cozinha desc limit 1`;
  
      // Executa no BD o script SQL
      const result = await prisma.$queryRawUnsafe(sql);
      console.log(result);
  
      // Validação para identificar se o retorno do banco é um array, vazio ou com dados
      if (Array.isArray(result) && result.length > 0) {
        return Number(result[0].id_receita_cozinha);
      } else {
        return false;
      }
  
    } catch (error) {
      console.error("Erro ao buscar último ID do gênero:", error);
      return false;
    }
} 

const setInsertReceitaCozinha = async function (receitaCozinha) {
    try {
    
      let sql = `
        INSERT INTO tbl_receita_cozinha (
          id_receita, 
          id_cozinha
        ) VALUES (
          ${receitaCozinha.id_receita},
          ${receitaCozinha.id_cozinha}
        )
      `;
      
  
      // Executa o comando de inserção no banco
      let result = await prisma.$executeRawUnsafe(sql);
  
      // Verifica se deu certo
      if (result) {
        return true;
      } else {
        return false;
      }
  
    } catch (error) {
  
      return false;
    }
  }

  const getSelectCozinhaByIdReceita = async function (idReceita) {
    try{
        let sql =   `select tbl_cozinha.id_cozinha, tbl_cozinha.id_cozinha
                     from tbl_receita
                            inner join tbl_receita_cozinha
                            on tbl_receita.id_receita = tbl_receita_cozinha.id_receita
                        inner join tbl_cozinha
                            on tbl_cozinha.id_cozinha = tbl_receita_cozinha.id_cozinha
                     where tbl_receita.id_receita=${idReceita}`
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)) {
            return result
        } else {
            return false
        }

    } catch (error) {
        console.log(error) //usar para achar o erro, se a API retornar erro 500, caso o erro for no banco de dados (se vira pra resolver kkkk)
        return false
    }
    }

const getSelectReceitaByIdCozinha = async function (idCozinha) {
        try{
            let sql =   `select tbl_receita.id_receita, tbl_receita.id_receita
                         from tbl_receita
                                inner join tbl_receita_cozinha
                                on tbl_receita.id_receita = tbl_receita_cozinha.id_receita
                            inner join tbl_cozinha
                                on tbl_cozinha.id_cozinha = tbl_receita_cozinha.id_cozinha
                         where tbl_cozinha.id_cozinha=${idCozinha}`
            let result = await prisma.$queryRawUnsafe(sql)
    
            if (Array.isArray(result)) {
                return result
            } else {
                return false
            }
    
        } catch (error) {
            console.log(error) //usar para achar o erro, se a API retornar erro 500, caso o erro for no banco de dados (se vira pra resolver kkkk)
            return false
        }
    } 



const setUpdateReceitaCozinha = async function (receitaCozinha) {

    try {
        let sql = `update tbl_receita_cozinha set
        id_receita  = '${receitaCozinha.id_receita}',
        id_cozinha = '${receitaCozinha.id_cozinha}'
        where id_receita_cozinha  =  ${receitaCozinha.id_receita_cozinha}`


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
const setDeleteReceitaCozinha = async function (id) {

    try{
        let sql = `DELETE FROM tbl_receita_cozinha WHERE id_filme_genero=${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return true
        }else{
            return true
        }
    }catch (error){
        return false
    }
    
}

const setDeleteByIdCozinhaAndReceitaId = async function (idReceita){
    try{
        let sql = `DELETE FROM tbl_receita_cozinha WHERE id_receita=${idReceita}`

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
    getSelectAllReceitaCozinha,
    getSelectBYIdReceitaCozinha,
    setInsertReceitaCozinha,
    getSelectCozinhaByIdReceita,
    getSelectReceitaByIdCozinha,
    getSelectLastIdReceitaCozinha,
    setUpdateReceitaCozinha,
    setDeleteByIdCozinhaAndReceitaId,
    setDeleteReceitaCozinha
}