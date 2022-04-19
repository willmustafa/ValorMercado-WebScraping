const path = require('path');
const pup = require('./utils/puppeteer-helper')
const file = require('./utils/file-management')

const Mercado = require('./Mercado')

const scrapper = require('./scrapper/mercados-scrapper')

async function pesquisa(){
   
    const browser = await pup.openBrowser(true)
    
    const searchFor = ((await file.readFile(path.join(__dirname,"../docs/searchFor/searchFor.txt"))).split(',')).map(x => x.replace('\n', ''))
    
    const page = await browser.newPage();
    await pup.blockContent(page)

    const mercadoClass = await new Mercado([ 'muffato'], searchFor);

    const scrappedProducts = await scrapper.searchProducts(mercadoClass, page)

    await browser.close();

    return scrappedProducts
}

module.exports = {
    pesquisa
};