const cleaning = require('./stringCleaner')
const file = require('../utils/file-management')

async function resultSplit(dados){
    dados = dados

    for (let i_dados = 0; i_dados < dados.length; i_dados++) {

        for (let i_produtos = 0; i_produtos < dados[i_dados].produtos.length; i_produtos++) {

            for (let i_results = 0; i_results < dados[i_dados].produtos[i_produtos].results.length; i_results++) {
                
                const produtoSeparado = await cleaning.separaDados(dados[i_dados].produtos[i_produtos].results[i_results].titulo)
                dados[i_dados].produtos[i_produtos].results[i_results].produto = 
                {...dados[i_dados].produtos[i_produtos].results[i_results].produto, ...produtoSeparado}
            }
        }
    }

    return dados
}

module.exports = {
    resultSplit
}