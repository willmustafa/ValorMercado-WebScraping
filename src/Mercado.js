const ProgressBar = require('progress');
const fs = require('fs');
const path = require('path');

module.exports = class Mercado {
    constructor(mercadoSelecionado, searchArray) {
        this.progressBar = '';
        this.limite = 3;
        this.searchFor = searchArray;
        this.mercado = mercadoSelecionado;
        this.listaMercados = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/listaMercados.json'), 'utf-8'));
        this.specificWait = this.listaMercados[this.mercado].specificWait;
    }

    setlimite(valor) {
        this.limite = valor
    }

    setprogressbar() {
        this.progressBar = new ProgressBar(':bar :percent de :total itens.', {
            total: this.limite * this.searchFor.length
        })
    }

    validaValor(valor) {
        if (valor.includes("R$")) {
            valor = valor.replace("R$", "")
        }

        if (valor.includes("cada")) {
            valor = valor.replace("cada", "")
        }

        return parseFloat(valor.replace(",", "."))
    }

    async searchProducts(page) {
        this.setprogressbar();

        let produtos = [this.mercado, []];
        for (let i = 0; i < this.searchFor.length; i++) {

            // Faz a pesquisa e aguarda a página carregar
            const input = await page.$(this.listaMercados[this.mercado].searchInput);
            await input.click({
                clickCount: 3
            })
            await input.type(this.searchFor[i], {
                delay: 20
            });

            await page.waitForTimeout(2000);

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
                    await page.click(this.listaMercados[this.mercado].searchButton)

                ]);
            }

            await page.waitForTimeout(2000);

            // Procura os elementos dos produtos listados
            const produtosLista = await page.$$(this.listaMercados[this.mercado].listaProdutos);

            let k = 0;
            // Retorna os dados da página
            for (const link of produtosLista) {
                if (k == this.limite) {
                    break;
                }
                const titulo = await link.$eval(this.listaMercados[this.mercado].produtoTitulo, x => x.innerText);

                let preco = "";

                if (this.listaMercados[this.mercado].produtoPrecoPromocao !== '') {
                    try {
                        await page.waitForSelector(selector_price, {
                            timeout: 200
                        })
                        preco = await link.$eval(this.listaMercados[this.mercado].produtoPrecoPromocao, x => x.innerText);
                    } catch {

                    }
                }

                try {
                    preco = await link.$eval(this.listaMercados[this.mercado].produtoPreco, x => x.innerText);
                } catch {

                }

                produtos[1].push([titulo, this.validaValor(preco)]);

                this.progressBar.tick();
                k++;
            }

        }

        return produtos;
    }

    async searchLink(page) {
        this.setprogressbar();

        let produtos = [this.mercado, []];


        for (let i = 0; i < this.searchFor.length; i++) {

            try {
                // Aguarda o reload da página
                await Promise.all([
                    page.waitForNavigation({
                        waitUntil: "domcontentloaded"
                    }),
                    await page.goto(this.searchFor[i])
                ])
    
                await page.waitForTimeout(2000);
    
                if (!page.url().includes('ProductLinkNotFound')) {
    
                    await page.waitForSelector(this.listaMercados[this.mercado].link_produtoTitulo);
    
                    // Procura os elementos dos produtos listados
                    const titulo = await page.$eval(this.listaMercados[this.mercado].link_produtoTitulo, x => x.innerText);
    
                    let preco = "";
    
                    if (this.listaMercados[this.mercado].link_produtoPromocao !== '') {
                        try {
                            await page.waitForSelector(selector_price, {
                                timeout: 200
                            })
                            preco = await page.$eval(this.listaMercados[this.mercado].link_produtoPromocao, x => x.innerText);
                        } catch {
    
                        }
                    }
    
                    try {
                        preco = await page.$eval(this.listaMercados[this.mercado].link_produtoPreco, x => x.innerText);
                    } catch {
    
                    }
    
                    produtos[1].push([titulo, this.validaValor(preco), this.searchFor[i]]);
    
                }

            } catch (error) {
                console.log("Erro no link: " + this.searchFor[i]);
                console.log(error)
            }
            

            this.progressBar.tick();

        }


        return produtos;
    }
}