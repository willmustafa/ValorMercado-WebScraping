const mercado = require('../Mercado.js');

/**
 * Procurar produtos listados no mercado Muffato
 * @param {puppeteer} page Page element from puppeteer
 * @returns Lista de produtos para o termo pesquisado
 */
async function procuraProdutos(page, searchFor) {
    
    const mercadoClass = new mercado('muffato', searchFor);

    await pageOpen(mercadoClass, page);

    let produtos = await mercadoClass.searchProducts(page);

    console.log('\nMuffato Completo\n');
    return produtos;
}

async function procuraProdutosLinks(page, searchFor){
    
    const mercadoClass = new mercado('muffato', searchFor);
    mercadoClass.setlimite(1);

    await pageOpen(mercadoClass, page);

    let produtos = await mercadoClass.searchLink(page);

    console.log('\nMuffato Completo\n');
    return produtos;
}

async function pageOpen(mercadoClass, page){

    await page.goto(mercadoClass.listaMercados.muffato.link);

    console.log("Procurando produtos no site do Muffato");

    // Modal para selecionar cidade
    await page.waitForSelector('#s-ch-alert');

    // Seletor de cidade
    await page.select('#s-ch-select-city', mercadoClass.listaMercados.muffato.id.toString());

    // Aguarda o reload da página
    await Promise.all([
        page.waitForNavigation({
            waitUntil: "domcontentloaded" 
        }),
        await page.click('#s-ch-change-channel')
    ])

    await page.waitForTimeout(4000);
}

module.exports.procuraProdutos = procuraProdutos;
module.exports.procuraProdutosLinks = procuraProdutosLinks;