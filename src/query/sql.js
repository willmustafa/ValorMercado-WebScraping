const pg = require('pg');
const pgClient = new pg.Client("postgres://postgres:admin@localhost:5432/mercados");

async function inserirBD(dados){
    try {
        await pgClient.connect();
        await pgClient.query("BEGIN");
        for (let i = 0; i < dados.length; i++) {
            var query = await pgClient.query("INSERT INTO public.historico (data, mercado, produto, valor, link) VALUES ($1, $2, $3, $4, $5);", dados[i]);
        }
        await pgClient.query("COMMIT")
    } catch (error) {
        console.log(`Falhou em inserir algo: ${error}`)
    }finally{
        await pgClient.end();
        console.log("Banco de dados inserido com sucesso.")
    }
    
}

module.exports.inserirBD = inserirBD;