const sql = require('../query/sql');

/**
 * Faz a separação da string na sequência correta
 * @param {string} word 
 * @returns array [palavra completa, produto, marca, unidade, valor da unidade]
 */
async function separaDados(word){
    const unidade = await removeUnidade(word);
    const valorUnidade = await pegaUltimoNumero(unidade[0]);
    const marca = await removeMarca(valorUnidade[0]);
    return [word, marca[0].trim(), marca[1], unidade[1], valorUnidade[1]];
}

/**
 * Transforma a string em minúscula e retira os acentos
 * @param {string} word 
 * @returns string
 */
function toLowerNormalize(word){
    return word.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
}

/**
 * Separa a marca de uma array de marcas
 * @param {string} word frase para retirar a marca
 * @returns array onde [0] é a frase sem a marca e [1] a marca retirada
 */
async function removeMarca(word){
    let marcas = await sql.getMarcas();
    word = toLowerNormalize(word);
    const marcaNaString = marcas.filter(x => word.includes(x));
    if(marcaNaString.length >= 1){
        return [word.split(marcaNaString[0] + " ")[0], marcaNaString[0]]
    }
    return [word, '']
}

/**
 * Separa a unidade da string
 * @param {string} word palavra com a unidade
 * @returns array onde [0] é a string sem unidade e [1] a unidade
 */
async function removeUnidade(word){
    word = toLowerNormalize(word);
    let unidade = await sql.getUnidades();
    const unidadeNaString = maiorStringArray(unidade.filter(x => word.endsWith(x)));
    if(unidadeNaString.length >= 1){
        return [word.substring(0, word.lastIndexOf(unidadeNaString)), unidadeNaString]
    }
    return [word, '']
}

/**
 * Separa o último número da string
 * @param {string} word palavra sem a unidade final
 * @returns array [0] é a string sem o numero e [1] o numero retirado
 */
function pegaUltimoNumero(word){
    const regex = /\d+$/g
    if(word.match(regex)){
        return [word.replace(regex, ''), word.match(regex)[0]]
    }
    return [word, '']
}

function maiorStringArray(arr){
    return arr.reduce(
        function (a, b) {
            return a.length > b.length ? a : b;
        }
    );
}

module.exports.separaDados = separaDados;