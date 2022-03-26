const path = require('path');
const fs = require('fs');
const pup = require("puppeteer");

const muffato = require('./mercados/muffato.js');
const cidadeCancao = require('./mercados/cidadeCancao.js');
const musamar = require('./mercados/musamar.js');
const almeida = require('./mercados/almeida.js');
const condor = require('./mercados/condor.js');

async function pegaNome(){
    const browser = await pup.launch({
        headless: true,
        defaultViewport: {
            width: 1800,
            height: 800,
            deviceScaleFactor: 1
        }
    });

    const searchFor = await fs.readFileSync(path.join(__dirname,"../docs/searchFor.txt"), 'utf-8').split(',');

    const page = await browser.newPage();

    let produtosFinais = [];

    produtosFinais.push(await muffato.procuraProdutos(page, searchFor));
    produtosFinais.push(await cidadeCancao.procuraProdutos(page, searchFor));
    produtosFinais.push(await musamar.procuraProdutos(page, searchFor));
    produtosFinais.push(await almeida.procuraProdutos(page, searchFor));
    produtosFinais.push(await condor.procuraProdutos(page, searchFor));

    await fs.writeFileSync(path.join(__dirname, "../docs/resultado.json"), JSON.stringify(produtosFinais));

    await browser.close();

    return produtosFinais;
}

module.exports.pegaNome = pegaNome;