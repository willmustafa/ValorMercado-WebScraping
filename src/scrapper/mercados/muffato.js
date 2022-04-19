async function pageOpen(mercadoClass, page){

    await page.goto(mercadoClass.listaMercados.muffato.link);

    console.log("Procurando produtos no site do Muffato");

    // Modal para selecionar cidade
    await page.waitForSelector('#s-ch-alert');

    // Seletor de cidade
    await page.select('#s-ch-select-city', mercadoClass.listaMercados.muffato.id.toString());

    // Aguarda o reload da página
    await Promise.all([
        page.waitForNavigation({
            waitUntil: "domcontentloaded" 
        }),
        await page.click('#s-ch-change-channel')
    ])

    await page.waitForTimeout(4000);
}

module.exports = {
    pageOpen
};