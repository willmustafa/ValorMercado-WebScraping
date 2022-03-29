const pg = require('pg');
const pgClient = new pg.Client("postgres://postgres:admin@localhost:5432/mercados");
const clean = require('../cleaning/wordCleaning')

try {
    pgClient.connect();
} catch (error) {
    console.log(`Falhou em inserir algo: ${error}`)
}

async function inserirBD(dados) {
    for (let i = 0; i < dados.length; i++) {
        try {
            // Adiciona o produto
            await pgClient.query(`do $$
                BEGIN
                IF NOT EXISTS (SELECT * FROM public.produtos WHERE produtos.produto = '${dados[i][5]}') THEN
                INSERT INTO public.produtos (produto) VALUES ('${dados[i][5]}');
                END IF;
                END;
                $$`);

            // adiciona tudo
            var query = await pgClient.query(`do $$
                BEGIN
                IF NOT EXISTS (SELECT * FROM public.historico 
                    WHERE historico.produto_completo = '${dados[i][2]}' 
                    AND historico.valor = '${dados[i][3]}' 
                    AND historico.data = '${dados[i][0]}' 
                    AND historico.id_marca = (SELECT id FROM public.marcas WHERE marcas.marca = '${dados[i][6]}')
                    AND historico.id_mercado = (SELECT id FROM public.mercado WHERE mercado.mercado = '${dados[i][1]}') ) THEN
                INSERT INTO public.historico (produto_completo, valor, href, data, quantidade, id_marca, id_mercado, id_produto, id_unidade) 
                VALUES ('${dados[i][2]}', '${dados[i][3]}', '${dados[i][4]}', '${dados[i][0]}', '${dados[i][8]}',
                    (SELECT id FROM public.marcas WHERE marcas.marca = '${dados[i][6]}'),
                    (SELECT id FROM public.mercado WHERE mercado.mercado = '${dados[i][1]}'),
                    (SELECT id FROM public.produtos WHERE produtos.produto = '${dados[i][5]}'),
                    (SELECT id FROM public.unidades WHERE unidades.unidade = '${dados[i][7]}')
                    ); 
                END IF;
                END;
                $$`);

        } catch (err) {
            console.log(`Falhou em inserir algo: ${err}`)
        }

    }

    pgClient.end();
            console.log("Banco de dados inserido com sucesso.")

}

async function gravarBD(array) {
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
            const tituloSeparado = await clean.separaDados(titulo);
            stringQuery.push([dataHoje, mercado, titulo, valor, href, tituloSeparado[1], tituloSeparado[2], tituloSeparado[3], tituloSeparado[4] == '' ? '1' : tituloSeparado[4]]);
        }
    }
    await inserirBD(stringQuery);
}

async function getMarcas() {
    try {
        var query = await pgClient.query({
            text: "SELECT marca FROM public.marcas;",
            rowMode: 'array'
        });
        return query.rows.flat();
    } catch (error) {
        console.log(`Falhou em inserir algo: ${error}`)
    }
}

async function getUnidades() {
    try {
        var query = await pgClient.query({
            text: "SELECT unidade FROM public.unidades;",
            rowMode: 'array'
        });
        return query.rows.flat();
    } catch (error) {
        console.log(`Falhou em inserir algo: ${error}`)
    }
}






module.exports.gravarBD = gravarBD;
module.exports.getMarcas = getMarcas;
module.exports.getUnidades = getUnidades;
module.exports.end = async function end() {
    await pgClient.end();
};
