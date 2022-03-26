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

async function gravarBD(array){
    let dataHoje = new Date().toLocaleString('pt-BR', {
        dateStyle: 'short'
    });

    let stringQuery = [];

    for (let i = 0; i < array.length; i++) {
        let mercado = array[i][0];
        for (let k = 0; k < array[i][1].length; k++) {
            const titulo = array[i][1][k][0];
            const valor = array[i][1][k][1];
            const href = array[i][1][k][2];
            stringQuery.push([dataHoje, mercado, titulo, valor, href]);
        }
    }

    await inserirBD(stringQuery);
}
module.exports.gravarBD = gravarBD;