const pup = require("puppeteer");

async function openBrowser(headlessT){
    console.log('Abrindo browser developer.')
    const browser = await pup.launch({
        headless: headlessT,
        defaultViewport: {
            width: 1800,
            height: 800,
            deviceScaleFactor: 1
        }
    });
    return browser
}

async function blockContent(page){
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
            req.abort();
        } else {
            req.continue();
        }
    });
}

module.exports = {
    openBrowser,
    blockContent
}