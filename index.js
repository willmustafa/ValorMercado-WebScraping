const file = require('./src/utils/file-management')
const args = process.argv.slice(2);

let listaProdutos = '';

(async ()=>{
    switch (args[0]){
        case 'produtos':
            const pegaNome = require('./src/pesquisar')
            listaProdutos = await pegaNome.pesquisa()
            await file.createFile_CurrentDate('./docs/results/resultados', listaProdutos)
            break;
        case 'marcas':
            const marcas = require('./src/scrapper/marcas-scrapper')
            await marcas.pesquisa()
            break;
        case 'ler-resultados':
            const cleaning = require('./src/cleaning/resultSplit')
            cleaning.resultSplit()
            break;
        case 'inserir-bd':
            const banco = require('./src/query/sql')
            banco.inserirNoBanco(await file.readFile('docs/results/resultados-20_04_2022.json'))
            break;
        default:
            console.log('Adicione a opção desejada:')
            console.log('> "produtos" para o arquivo de nome de produtos')
            console.log('> "marcas" para baixar a lista de marcas do site do Muffato')
            break;
    }

    
    
})()