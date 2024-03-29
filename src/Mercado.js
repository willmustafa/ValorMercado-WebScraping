const ProgressBar = require('progress');
const fs = require('fs');
const path = require('path');

module.exports = class Mercado {
    constructor(mercadosArray, searchArray) {
        this.progressBar = '';
        this.limite = 100;
        this.searchFor = searchArray;
        this.mercadosToSearch = mercadosArray;
        // this.specificWait = this.listaMercados[this.mercado].specificWait;
        this.listaMercados = {
            "muffato": {
                "link": "https://delivery.supermuffato.com.br/",
                "nome": "Super Muffato",
                "id": "14",
                "searchInput": ".fulltext-search-box",
                "searchButton": "#header-btn-search",
                "specificWait": ".prd-list-item-desc > .prd-list-item-link",
                "listaProdutos": ".prd-list-item-desc > .prd-list-item-link",
                "produtoTitulo": ".prd-list-item-name",
                "produtoPrecoPromocao": "",
                "produtoPreco": ".prd-list-item-price-sell",
                "link_produtoTitulo": ".productName",
                "link_produtoPreco": ".skuBestPrice",
                "link_produtoPromocao": ""
            },
            "musamar": {
                "link": "https://www.sitemercado.com.br/supermercadosmusamar/londrina-loja-jardim-centro-r-pio-xii",
                "nome": "Musamar",
                "id": "",
                "searchInput": "app-previous-auto-complete input.form-control",
                "searchButton": ".header-area-btn-search",
                "specificWait": "div:not(.fake-loading).products-view.ng-star-inserted a.list-product-link",
                "listaProdutos": "app-list-product-item",
                "produtoTitulo": "h3 > .list-product-link",
                "produtoPreco": ".area-bloco-preco",
                "link_produtoTitulo": ".product-desc .ng-star-inserted h1",
                "link_produtoPreco": ".area-preco-detalhe-produto .bloco-preco",
                "link_produtoPromocao": ""
            },
            "condor": {
                "link": "https://www.condor.com.br/",
                "nome": "Condor",
                "id": "32",
                "searchInput": "app-header input.form-control",
                "searchButton": "enter",
                "specificWait": "app-product",
                "listaProdutos": "section#search > div > div.row app-product",
                "produtoTitulo": ".title",
                "produtoPrecoPromocao": ".price",
                "produtoPreco": ".price-normal",
                "link_produtoTitulo": "#DetalheProduto h2.titulo",
                "link_produtoPreco": ".precos .clube p",
                "link_produtoPromocao": ""
            },
            "cidadeCancao": {
                "link": "https://londrina.cidadecancao.com/",
                "nome": "Cidade Canção",
                "id": "86060060",
                "searchInput": "form #search",
                "searchButton": "form #form-search-button",
                "specificWait": ".category-products .item",
                "listaProdutos": ".category-products .item",
                "produtoTitulo": ".product-name > a",
                "produtoPrecoPromocao": ".special-price .price",
                "produtoPreco": ".price-box .price",
                "link_produtoTitulo": ".product-shop .product-name h2",
                "link_produtoPreco": ".price-box .price",
                "link_produtoPromocao": ""
            },
            "almeidaMercados": {
                "link": "https://www.sitemercado.com.br/almeidamercados/londrina-loja-armazem-da-moda-amaro-rua-aracatuba",
                "nome": "Almeida Mercados",
                "id": "86060060",
                "searchInput": "app-previous-auto-complete input.form-control",
                "searchButton": ".header-area-btn-search",
                "specificWait": "div:not(.fake-loading).products-view.ng-star-inserted a.list-product-link",
                "listaProdutos": "app-list-product-item",
                "produtoTitulo": "h3 > .list-product-link",
                "produtoPreco": ".area-bloco-preco",
                "link_produtoTitulo": ".product-desc .ng-star-inserted h1",
                "link_produtoPreco": ".area-preco-detalhe-produto .bloco-preco",
                "link_produtoPromocao": ""
            }
        };
    }

    setlimite(valor) {
        this.limite = valor
    }

    setprogressbar(ntotal) {
        this.progressBar = new ProgressBar(`:bar :percent de :total itens.`, {
            total: ntotal
        })
    }
    
}