const {
    ElementHandle
} = require('puppeteer');
const mercado = require('../Mercado.js');

/**
 * Procurar produtos listados no mercado almeidaMercados
 * @param {puppeteer} page Page element from puppeteer
 * @returns Lista de produtos para o termo pesquisado
 */
async function procuraProdutos(page, searchFor) {

    const mercadoClass = new mercado('almeida', searchFor);
    mercadoClass.setlimite(1);

    await pageOpen(mercadoClass, page);

    let produtos = await mercadoClass.searchProducts(page);

    console.log('\nAlmeida Mercados Completo\n');
    return produtos;
}

async function procuraProdutosLinks(page, searchFor){
    
    const mercadoClass = new mercado('almeidaMercados', searchFor);
    mercadoClass.setlimite(1);

    await pageOpen(mercadoClass, page);

    let produtos = await mercadoClass.searchLink(page);

    console.log('\nAlmeida Completo\n');
    return produtos;
}

async function pageOpen(mercadoClass, page){

    await page.goto(mercadoClass.listaMercados.almeidaMercados.link);

    await page.waitForTimeout(5000);
}

module.exports.procuraProdutos = procuraProdutos;
module.exports.procuraProdutosLinks = procuraProdutosLinks;