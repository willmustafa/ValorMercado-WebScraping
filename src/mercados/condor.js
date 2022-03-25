const mercado = require('../Mercado.js');

/**
 * Procurar produtos listados no mercado condor
 * @param {puppeteer} page Page element from puppeteer
 * @returns Lista de produtos para o termo pesquisado
 */
async function procuraProdutos(page, searchFor) {
    
    const mercadoClass = new mercado('condor', searchFor);

    await pageOpen(mercadoClass, page);

    let produtos = await mercadoClass.searchProducts(page);

    console.log('\ncondor Completo\n');
    return produtos;
}

async function procuraProdutosLinks(page, searchFor){
    
    const mercadoClass = new mercado('condor', searchFor);
    mercadoClass.setlimite(1);

    await pageOpen(mercadoClass, page);

    let produtos = await mercadoClass.searchLink(page);

    console.log('\nCondor Completo\n');
    return produtos;
}

async function pageOpen(mercadoClass, page){

    await page.goto(mercadoClass.listaMercados.condor.link);

    await page.waitForTimeout(4000);

    console.log("Procurando produtos no site do condor");

    // Modal para selecionar cidade
    await page.waitForSelector('app-select-loja a.nav-link');
    await page.click('app-select-loja a.nav-link');

    await page.waitForSelector('.modal.show');

    // Seletor de cidade
    await page.select('.modal select.browser-default.custom-select', mercadoClass.listaMercados.condor.id.toString());

    await page.waitForTimeout(4000);

    await page.select('.modal select.ng-valid', "71");

    await page.click('.modal .modal-body button');    
}

module.exports.procuraProdutos = procuraProdutos;
module.exports.procuraProdutosLinks = procuraProdutosLinks;