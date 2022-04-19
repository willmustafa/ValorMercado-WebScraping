const file = require('./src/utils/file-management')
const args = process.argv.slice(2);

let listaProdutos = '';

(async ()=>{
    switch (args[0]){
        case 'palavras':
            const pegaNome = require('./src/pesquisar');
            listaProdutos = await pegaNome.pesquisa();
            break;
        default:
            console.log('Adicione a opção desejada: "palavras" para o arquivo de nome de produtos');
    }

    await file.createFile_CurrentDate('./docs/results/resultados', listaProdutos)
    
})()