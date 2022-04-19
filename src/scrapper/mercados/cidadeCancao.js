async function pageOpen(mercadoClass, page){

    await page.goto(mercadoClass.listaMercados.cidadeCancao.link);

    console.log("Procurando produtos no site do Cidade Canção");

    await page.waitForTimeout(7000);

    // Modal para selecionar cidade
    await page.waitForSelector('input#cepLocalizacao');

    // Seletor de cidade
    await page.type('input#cepLocalizacao', mercadoClass.listaMercados.cidadeCancao.id, {
        delay: 50
    });
    await page.click('button.btn-pesquisar');

    await page.waitForSelector('#loja-content > li');
    await page.click('#loja-content > li');

    await page.click('#btnConcluir');
}

module.exports = {
    pageOpen
};