const path = require('path');
const fs = require('fs');
const pup = require("puppeteer");
const fetch = require("node-fetch");

const muffato = require('./mercados/muffato.js');
const cidadeCancao = require('./mercados/cidadeCancao.js');
const musamar = require('./mercados/musamar.js');
const almeida = require('./mercados/almeida.js');
const condor = require('./mercados/condor.js');

const sql = require('./query/sql.js');

(async () => {
    const browser = await pup.launch({
        headless: true,
        defaultViewport: {
            width: 1800,
            height: 800,
            deviceScaleFactor: 1
        }
    });

    const searchFor = JSON.parse(await fs.readFileSync(path.join(__dirname, "../docs/searchLinks.json"), 'utf-8'));

    const page = await browser.newPage();

    let produtosFinais = [];

    // produtosFinais.push(await muffato.procuraProdutosLinks(page, searchFor["muffato"]));
    // produtosFinais.push(await cidadeCancao.procuraProdutosLinks(page, searchFor["cidadeCancao"]));
    produtosFinais.push(await musamar.procuraProdutosLinks(page, searchFor["musamar"]));
    produtosFinais.push(await almeida.procuraProdutosLinks(page, searchFor["almeidaMercados"]));
    // produtosFinais.push(await condor.procuraProdutosLinks(page, searchFor["condor"]));

    await fs.writeFileSync(path.join(__dirname, "../docs/resultado.json"), JSON.stringify(produtosFinais));

    await browser.close();

    await inserirBD(produtosFinais);

})()

async function inserirBD(array){
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

    await sql.inserirBD(stringQuery);
}