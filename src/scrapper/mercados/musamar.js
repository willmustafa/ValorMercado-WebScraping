async function pageOpen(mercadoClass, page){

    await page.goto(mercadoClass.listaMercados.musamar.link);

    console.log("Procurando produtos no site do musamar");

    // Modal para selecionar cidade
    await page.waitForSelector(mercadoClass.listaMercados.musamar.searchInput);
}

module.exports = {
    pageOpen
};