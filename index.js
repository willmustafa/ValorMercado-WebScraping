const args = process.argv.slice(2);

let listaProdutos = '';

(async ()=>{
    switch (args[0]){
        case 'links':
            const pegaLinks = require('./src/pesquisaLink');
            listaProdutos = await pegaLinks.pesquisaLink();
            break;
        case 'arquivo':
            const pegaNome = require('./src/pesquisaNome');
            listaProdutos = await pegaNome.pesquisaNome();
            break;
        default:
            console.log('Adicione a opção desejada: "link" para abrir o arquivo com a lista de links ou "arquivo" para o arquivo de nome de produtos');
    }
    
    switch (args[1]){
        case 'bd':
            const sql = require('./src/query/sql.js');
            await sql.gravarBD(listaProdutos);
            break;
    }

})()