const pg = require('pg');
const pgClient = new pg.Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'admin',
    database: 'mercados'
});

async function inserirNoBanco(dados) {
    pgClient.connect()

    await checarTablesExiste()

    console.log('Inserindo dados no Banco de Dados')
    dados = JSON.parse(dados)

    for (let i_dados = 0; i_dados < dados.length; i_dados++) {

        for (let i_produtos = 0; i_produtos < dados[i_dados].produtos.length; i_produtos++) {

            for (let i_results = 0; i_results < dados[i_dados].produtos[i_produtos].results.length; i_results++) {

                await inserirLinha(dados[i_dados].produtos[i_produtos].results[i_results])
            }
        }
    }

    pgClient.end()

    console.log('Inserido com Sucesso!')
}

async function inserirLinha(dados) {

    await pgClient.query(`
                INSERT INTO public.Historico(produto_completo, marca, unidade, valorunidade, preco, data) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
            dados.titulo,
            dados.produto.marca,
            dados.produto.unidade,
            ifNaN_Null(dados.produto.valorUnidade),
            ifNaN_Null(dados.produto.preco),
            new Date().toISOString()
        ])
}

function ifNaN_Null(data){
    return isNaN(Number.parseFloat(data)) ? null : Number.parseFloat(data).toFixed(2)
}

async function checarTablesExiste() {
    await pgClient.query(`
            CREATE TABLE IF NOT EXISTS public.Historico (
                id_historico serial PRIMARY KEY,
                produto_completo varchar(255),
                marca varchar(255),
                unidade varchar(50),
                valorUnidade decimal(2),
                preco decimal(2)
            )
    `)
}

module.exports = {
    inserirNoBanco
}