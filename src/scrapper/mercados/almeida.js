async function pageOpen(mercadoClass, page){

    await page.goto(mercadoClass.listaMercados.almeidaMercados.link);

    await page.waitForTimeout(5000);
}

module.exports = {
    pageOpen
};