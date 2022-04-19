const validator = require('../utils/validator')

async function searchProducts(mercadoClass, page) {
    const musamar = require('./mercados/musamar')
    const almeida = require('./mercados/almeida')
    const condor = require('./mercados/condor')
    const cidadeCancao = require('./mercados/cidadeCancao')
    const muffato = require('./mercados/muffato')

    let produtos = []

    // Itera a lista de Mercados para pesquisar
    for (let f = 0; f < mercadoClass.mercadosToSearch.length; f++) {

        const currentMercado = mercadoClass.mercadosToSearch[f]

        // Abre o mercado atual seguindo a ordem necessária
        await eval(currentMercado).pageOpen(mercadoClass, page)

        let currentSearchProducts = []

        // Itera a lista de produtos para pesquisar
        for (let i = 0; i < mercadoClass.searchFor.length; i++) {

            // Checa se o termo para pesquisa não é vazio
            if (mercadoClass.searchFor[i] !== '') {

                currentSearchProducts.push({
                    searchedTerm: mercadoClass.searchFor[i],
                    results: []
                })

                // Faz a pesquisa e aguarda a página carregar
                const input = await page.$(mercadoClass.listaMercados[currentMercado].searchInput);
                await input.click({
                    clickCount: 3
                })
                await input.type(mercadoClass.searchFor[i], {
                    delay: 20
                });

                // // Espera 2 segundos para evitar problemas em sites que usam react
                // await page.waitForTimeout(2000);

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

                // Espera 2 segundos para evitar problemas em sites que usam react
                // await page.waitForTimeout(1000);

                // Procura os elementos dos produtos listados
                const produtosLista = await page.$$(mercadoClass.listaMercados[currentMercado].listaProdutos);

                mercadoClass.setprogressbar(produtosLista.length, mercadoClass.searchFor[i]);

                // Retorna os dados da página
                for (const link of produtosLista) {
                    const titulo = await link.$eval(mercadoClass.listaMercados[currentMercado].produtoTitulo, x => x.innerText);

                    let preco = "";

                    // Se a classe tem um item para preço em promoção
                    if (mercadoClass.listaMercados[currentMercado].produtoPrecoPromocao !== '') {
                        try {
                            await page.waitForSelector(selector_price, {
                                timeout: 200
                            })
                            preco = await link.$eval(mercadoClass.listaMercados[currentMercado].produtoPrecoPromocao, x => x.innerText);
                        } catch {

                        }
                    } else {
                        try {
                            preco = await link.$eval(mercadoClass.listaMercados[currentMercado].produtoPreco, x => x.innerText);
                        } catch {

                        }

                    }

                    currentSearchProducts[i].results.push({
                            titulo,
                            preco
                        })

                    mercadoClass.progressBar.tick();
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

module.exports = {
    searchProducts
}