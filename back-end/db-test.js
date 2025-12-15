// db-test.js
const mysql = require('mysql2/promise');

async function testarConexao() {
    try {
        const conexao = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'sua_senha',
            database: 'nome_do_banco'
        });

        console.log('✓ Conexão realizada com sucesso!');
        await conexao.end();
    } catch (erro) {
        console.log('✗ Erro ao conectar ao banco:', erro.message);
    }
}

testarConexao();
