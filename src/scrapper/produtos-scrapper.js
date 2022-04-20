const cleaning = require('../cleaning/stringCleaner')
let mercadoClass = ''
let page = ''
const musamar = require('./mercados/musamar')
const almeida = require('./mercados/almeida')
const condor = require('./mercados/condor')
const cidadeCancao = require('./mercados/cidadeCancao')
const muffato = require('./mercados/muffato')

async function searchProducts(_mercadoClass, _page) {
    
    let produtos = []
    mercadoClass = _mercadoClass
    page = _page

    // Itera a lista de Mercados para pesquisar
    for (let f = 0; f < mercadoClass.mercadosToSearch.length; f++) {

        const currentMercado = mercadoClass.mercadosToSearch[f]

        // Abre o mercado atual seguindo a ordem necessária
        await eval(currentMercado).pageOpen(mercadoClass, page)

        let currentSearchProducts = []

        mercadoClass.setprogressbar(mercadoClass.searchFor.length)
        // Itera a lista de produtos para pesquisar
        for (let i = 0; i < mercadoClass.searchFor.length; i++) {

            mercadoClass.progressBar.tick();

            // Checa se o termo para pesquisa não é vazio
            if (mercadoClass.searchFor[i] !== '') {

                currentSearchProducts.push({
                    searchedTerm: mercadoClass.searchFor[i],
                    results: []
                })

                // Faz a pesquisa e aguarda a página carregar
                await botaoPesquisa(currentMercado, i)

                // Procura os elementos dos produtos listados
                await page.waitForSelector(mercadoClass.listaMercados[currentMercado].listaProdutos)
                const produtosLista = await page.$$(mercadoClass.listaMercados[currentMercado].listaProdutos);

                // Retorna os dados da página
                for (const link of produtosLista) {
                    const titulo = await link.$eval(mercadoClass.listaMercados[currentMercado].produtoTitulo, x => x.innerText);

                    let preco = await getPreco(currentMercado, link)

                    currentSearchProducts[i].results.push({
                        titulo,
                        produto: {preco} 
                    })
                }
            }
        }

        produtos.push({
            mercado: currentMercado,
            produtos: currentSearchProducts
        })
    }

    return produtos
}

async function getPreco(currentMercado, link) {
    let preco = ""

    try{
        // Se a classe tem um item para preço em promoção
        if (mercadoClass.listaMercados[currentMercado].produtoPrecoPromocao !== '') {
            preco = await link.$eval(mercadoClass.listaMercados[currentMercado].produtoPrecoPromocao, x => x.innerText);
    
        } else {
            preco = await link.$eval(mercadoClass.listaMercados[currentMercado].produtoPreco, x => x.innerText);
        }
    }catch{

    }

    return cleaning.limpaPrecos(preco)
}

async function botaoPesquisa(currentMercado, i){
    // Faz a pesquisa e aguarda a página carregar
    await page.waitForSelector(mercadoClass.listaMercados[currentMercado].searchInput)
    const input = await page.$(mercadoClass.listaMercados[currentMercado].searchInput);
    try {
        await input.click({
            clickCount: 3
        })
    } catch {
        
    }
    await input.type(mercadoClass.searchFor[i], {
        delay: 20
    });

    // // Espera 2 segundos para evitar problemas em sites que usam react
    await page.waitForTimeout(2000);

    // Tenta dar enter na pesquisa, se não, tenta clicar no botão de search
    try {
        await Promise.all([
            page.waitForNavigation({
                waitUntil: 'load'
            }),
            await input.press('Enter')
        ]);
    } catch (error) {
        await Promise.all([
            page.waitForNavigation({
                waitUntil: 'load'
            }),
            await page.click(mercadoClass.listaMercados[currentMercado].searchButton)
        ]);
    }
}

module.exports = {
    searchProducts
}