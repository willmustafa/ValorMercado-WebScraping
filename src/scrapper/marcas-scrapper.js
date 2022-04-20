const pup = require('../utils/puppeteer-helper')
const file = require('../utils/file-management')
const muffato = require('./mercados/muffato')
const Mercados = require('../Mercado')

async function pesquisa(){
   
    const browser = await pup.openBrowser(true)
    
    const page = await browser.newPage();
    await pup.blockContent(page)

    const mercadoClass = new Mercados([ 'muffato'], '')

    await muffato.pageOpen(mercadoClass, page)

    const links = [
        'https://delivery.supermuffato.com.br/mercearia-e-alimentos/arroz?PS=20',
        'https://delivery.supermuffato.com.br/mercearia-e-alimentos/feijao?PS=20',
        'https://delivery.supermuffato.com.br/mercearia-e-alimentos/acucares?PS=20',
        'https://delivery.supermuffato.com.br/mercearia-e-alimentos/massas?PS=20',
        'https://delivery.supermuffato.com.br/mercearia-e-alimentos/oleos-e-azeites?PS=20',
        'https://delivery.supermuffato.com.br/mercearia-e-alimentos/farinaceos-e-amidos?PS=20',
        'https://delivery.supermuffato.com.br/mercearia-e-alimentos/cafes-e-chas?PS=20',
        'https://delivery.supermuffato.com.br/mercearia-e-alimentos/sopas-e-caldos?PS=20',
        'https://delivery.supermuffato.com.br/mercearia-e-alimentos/condimentos-e-conservas?PS=20',
        'https://delivery.supermuffato.com.br/mercearia-e-alimentos/pipocas?PS=20',
        'https://delivery.supermuffato.com.br/mercearia-e-alimentos/salgadinhos-e-snacks?PS=20',
        'https://delivery.supermuffato.com.br/mercearia-e-alimentos/biscoitos?PS=20',
        'https://delivery.supermuffato.com.br/mercearia-e-alimentos/aveias-e-cereais?PS=20',
        'https://delivery.supermuffato.com.br/mercearia-e-alimentos/matinais?PS=20',
        'https://delivery.supermuffato.com.br/mercearia-e-alimentos/sobremesas?PS=20',
        'https://delivery.supermuffato.com.br/mercearia-e-alimentos/bomboniere?PS=20',
        'https://delivery.supermuffato.com.br/mercearia-e-alimentos/orientais?PS=20',
        'https://delivery.supermuffato.com.br/mercearia-e-alimentos/alimentacao-infantil?PS=20',
        'https://delivery.supermuffato.com.br/mercearia-e-alimentos/mundo-saudavel?PS=20',
        'https://delivery.supermuffato.com.br/carnes-aves-e-peixes/carnes-bovinas?PS=20',
        'https://delivery.supermuffato.com.br/carnes-aves-e-peixes/carnes-suinas?PS=20',
        'https://delivery.supermuffato.com.br/carnes-aves-e-peixes/linguicas?PS=20',
        'https://delivery.supermuffato.com.br/carnes-aves-e-peixes/frango?PS=20',
        'https://delivery.supermuffato.com.br/carnes-aves-e-peixes/peixes-e-frutos-do-mar?PS=20',
        'https://delivery.supermuffato.com.br/carnes-aves-e-peixes/ovinos-e-aves?PS=20',
        'https://delivery.supermuffato.com.br/higiene-e-beleza/cabelo?PS=20',
        'https://delivery.supermuffato.com.br/higiene-e-beleza/sabonetes?PS=20',
        'https://delivery.supermuffato.com.br/higiene-e-beleza/desodorantes?PS=20',
        'https://delivery.supermuffato.com.br/higiene-e-beleza/higiene-oral?PS=20',
        'https://delivery.supermuffato.com.br/higiene-e-beleza/barbearia-e-depilacao?PS=20',
        'https://delivery.supermuffato.com.br/higiene-e-beleza/facial?PS=20',
        'https://delivery.supermuffato.com.br/higiene-e-beleza/cuidados-pessoais?PS=20',
        'https://delivery.supermuffato.com.br/higiene-e-beleza/cremes-para-o-corpo?PS=20',
        'https://delivery.supermuffato.com.br/higiene-e-beleza/bronzeadores-e-filtro-solar?PS=20',
        'https://delivery.supermuffato.com.br/higiene-e-beleza/repelentes?PS=20',
        'https://delivery.supermuffato.com.br/higiene-e-beleza/higiene-infantil?PS=20',
        'https://delivery.supermuffato.com.br/higiene-e-beleza/maos-e-pes?PS=20',
        'https://delivery.supermuffato.com.br/higiene-e-beleza/higiene-intima?PS=20',
        'https://delivery.supermuffato.com.br/bazar/casa-e-cozinha?PS=20',
        'https://delivery.supermuffato.com.br/bazar/churrasco?PS=20',
        'https://delivery.supermuffato.com.br/bazar/descartaveis?PS=20',
        'https://delivery.supermuffato.com.br/bazar/lampadas-e-pilhas?PS=20',
        'https://delivery.supermuffato.com.br/bazar/duchas-e-chuveiros?PS=20',
        'https://delivery.supermuffato.com.br/bazar/ferramentas?PS=20',
        'https://delivery.supermuffato.com.br/bazar/papelaria?PS=20',
        'https://delivery.supermuffato.com.br/bazar/automotivo?PS=20',
        'https://delivery.supermuffato.com.br/bazar/cama-mesa-e-banho?PS=20',
        'https://delivery.supermuffato.com.br/bazar/lazer-e-camping?PS=20',
        'https://delivery.supermuffato.com.br/hortifruti/frutas?PS=20',
        'https://delivery.supermuffato.com.br/hortifruti/frutas-processadas?PS=20',
        'https://delivery.supermuffato.com.br/hortifruti/legumes?PS=20',
        'https://delivery.supermuffato.com.br/hortifruti/verduras?PS=20',
        'https://delivery.supermuffato.com.br/hortifruti/ovos?PS=20',
        'https://delivery.supermuffato.com.br/hortifruti/organicos?PS=20',
        'https://delivery.supermuffato.com.br/hortifruti/sucos?PS=20',
        'https://delivery.supermuffato.com.br/congelados/pratos-prontos?PS=20',
        'https://delivery.supermuffato.com.br/congelados/sorvetes?PS=20',
        'https://delivery.supermuffato.com.br/congelados/petiscos-e-empanados?PS=20',
        'https://delivery.supermuffato.com.br/congelados/hamburgueres?PS=20',
        'https://delivery.supermuffato.com.br/congelados/lanches-prontos?PS=20',
        'https://delivery.supermuffato.com.br/congelados/legumes-congelados?PS=20',
        'https://delivery.supermuffato.com.br/congelados/polpas-de-frutas?PS=20',
        'https://delivery.supermuffato.com.br/congelados/sobremesas?PS=20',
        'https://delivery.supermuffato.com.br/congelados/paes-de-alho?PS=20',
        'https://delivery.supermuffato.com.br/limpeza/roupas?PS=20',
        'https://delivery.supermuffato.com.br/limpeza/desodorizantes-para-banheiro?PS=20',
        'https://delivery.supermuffato.com.br/limpeza/limpadores?PS=20',
        'https://delivery.supermuffato.com.br/limpeza/detergentes?PS=20',
        'https://delivery.supermuffato.com.br/limpeza/saponaceos?PS=20',
        'https://delivery.supermuffato.com.br/limpeza/desinfetantes?PS=20',
        'https://delivery.supermuffato.com.br/limpeza/inseticidas?PS=20',
        'https://delivery.supermuffato.com.br/limpeza/purificadores-de-ar?PS=20',
        'https://delivery.supermuffato.com.br/limpeza/ceras-e-lustra-moveis?PS=20',
        'https://delivery.supermuffato.com.br/limpeza/alcool-e-removedores?PS=20',
        'https://delivery.supermuffato.com.br/limpeza/utensilios-para-limpeza?PS=20',
        'https://delivery.supermuffato.com.br/limpeza/sacos-e-lixeiras?PS=20',
        'https://delivery.supermuffato.com.br/limpeza/papel-higienico?PS=20',
        'https://delivery.supermuffato.com.br/frios-e-laticinios/laticinios?PS=20',
        'https://delivery.supermuffato.com.br/frios-e-laticinios/manteigas-e-margarinas?PS=20',
        'https://delivery.supermuffato.com.br/frios-e-laticinios/requeijoes?PS=20',
        'https://delivery.supermuffato.com.br/frios-e-laticinios/queijos?PS=20',
        'https://delivery.supermuffato.com.br/frios-e-laticinios/embutidos?PS=20',
        'https://delivery.supermuffato.com.br/frios-e-laticinios/massas-frescas?PS=20',
        'https://delivery.supermuffato.com.br/bebidas/bebidas-alcoolicas?PS=20',
        'https://delivery.supermuffato.com.br/bebidas/bebidas-nao-alcoolicas?PS=20',
        'https://delivery.supermuffato.com.br/padaria',
        'https://delivery.supermuffato.com.br/pet-shop',
        'https://delivery.supermuffato.com.br/eletroportateis'
    ]

    let listaMarcas = []

    mercadoClass.setprogressbar(links.length)
    for (let i = 0; i < links.length; i++) {

        mercadoClass.progressBar.tick();
        await page.goto(links[i])

        listaMarcas.push(await page.evaluate(
            () => [...document.querySelectorAll('.refino-marca label')].map(el => el.innerText)
        ))
    }

    await browser.close();

    const marcasCleanned = listaMarcas.flat().map(el => limpaParentesis(el))

    await file.createFile('./docs/config/marcas', marcasCleanned)
}

function limpaParentesis(value){
    if(value.lastIndexOf(')') !== -1){
        return value.substr(0, value.lastIndexOf(')') - 3 )
    }
}

module.exports = {
    pesquisa
};