const path = require('path');
const fs = require('fs');

async function createFile(pathInput, data) {
    try {
        console.log('Salvando arquivo.')
        await fs.writeFileSync(path.join(__dirname, `../../${pathInput}.json`), JSON.stringify(data));
        console.log('Arquivo salvo com sucesso!')
    } catch (error) {
        console.log(error)
    }
}

async function readFile(pathInput) {
    let dataRead = ''
    try {
        dataRead = await fs.readFileSync(path.join(__dirname, `../../${pathInput}`), 'utf-8')
    } catch (error) {
        console.log(error)
    }finally{
        return dataRead
    }
}

async function createFile_CurrentDate(pathInput, data){
    const today = new Date()
    const todayFormatted = today.toLocaleDateString('pt-BR').replaceAll('/', '_')
    await createFile(`${pathInput}-${todayFormatted}`, data)
}

module.exports = {
    createFile,
    readFile,
    createFile_CurrentDate
}