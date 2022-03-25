const mercado = require('../Mercado.js');

/**
 * Procurar produtos listados no mercado cidadeCancao
 * @param {puppeteer} page Page element from puppeteer
 * @returns Lista de produtos para o termo pesquisado
 */
async function procuraProdutos(page, searchFor) {
    const mercadoClass = new mercado('cidadeCancao', searchFor);

    await pageOpen(mercadoClass, page);

    let produtos = await mercadoClass.searchProducts(page);

    console.log('\nCidade Canção Completo\n');
    return produtos;

}

async function procuraProdutosLinks(page, searchFor){
    
    const mercadoClass = new mercado('cidadeCancao', searchFor);
    mercadoClass.setlimite(1);

    await pageOpen(mercadoClass, page);

    let produtos = await mercadoClass.searchLink(page);

    console.log('\nCidade Canção Completo\n');
    return produtos;
}

async function pageOpen(mercadoClass, page){

    await page.goto(mercadoClass.listaMercados.cidadeCancao.link);

    console.log("Procurando produtos no site do Cidade Canção");

    await page.waitForTimeout(7000);

    // Modal para selecionar cidade
    await page.waitForSelector('input#cepLocalizacao');

    // Seletor de cidade
    await page.type('input#cepLocalizacao', mercadoClass.listaMercados.cidadeCancao.id, {
        delay: 50
    });
    await page.click('button.btn-pesquisar');

    await page.waitForSelector('#loja-content > li');
    await page.click('#loja-content > li');

    await page.click('#btnConcluir');
}

module.exports.procuraProdutos = procuraProdutos;
module.exports.procuraProdutosLinks = procuraProdutosLinks;