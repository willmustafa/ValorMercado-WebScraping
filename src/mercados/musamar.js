const mercado = require('../Mercado.js');

/**
 * Procurar produtos listados no mercado Muffato
 * @param {puppeteer} page Page element from puppeteer
 * @returns Lista de produtos para o termo pesquisado
 */
async function procuraProdutos(page, searchFor) {
    
    const mercadoClass = new mercado('musamar', searchFor);
    
    await pageOpen(mercadoClass, page);

    let produtos = await mercadoClass.searchProducts(page);

    console.log('\nmusamar Completo\n');
    return produtos;
}

async function procuraProdutosLinks(page, searchFor){
    
    const mercadoClass = new mercado('musamar', searchFor);
    mercadoClass.setlimite(1);
    
    await pageOpen(mercadoClass, page);

    let produtos = await mercadoClass.searchLink(page);

    console.log('\nMusamar Completo\n');
    return produtos;
}

async function pageOpen(mercadoClass, page){

    await page.goto(mercadoClass.listaMercados.musamar.link);

    console.log("Procurando produtos no site do musamar");

    // Modal para selecionar cidade
    await page.waitForSelector(mercadoClass.listaMercados.musamar.searchInput);
}

module.exports.procuraProdutos = procuraProdutos;
module.exports.procuraProdutosLinks = procuraProdutosLinks;