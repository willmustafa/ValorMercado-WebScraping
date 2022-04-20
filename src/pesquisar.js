const pup = require('./utils/puppeteer-helper')
const file = require('./utils/file-management')
const Mercado = require('./Mercado')
const scrapper = require('./scrapper/produtos-scrapper')
const cleaning = require('./cleaning/resultSplit')

async function pesquisa(){
   
    const browser = await pup.openBrowser(true)
    
    const searchFor = ((await file.readFile("docs/searchFor/searchFor.txt")).split(',')).map(x => x.replace('\n', ''))
    
    const page = await browser.newPage();
    await pup.blockContent(page)

    const mercadoClass = await new Mercado([ 'muffato'], searchFor);

    const scrappedProducts = await scrapper.searchProducts(mercadoClass, page)

    await browser.close();

    return await cleaning.resultSplit(scrappedProducts)
}

module.exports = {
    pesquisa
};