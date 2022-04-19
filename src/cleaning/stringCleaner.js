function limpaPrecos(valor) {
    if (valor.includes("R$")) {
        valor = valor.replace("R$", "")
    }

    if (valor.includes("cada")) {
        valor = valor.replace("cada", "")
    }

    return parseFloat(valor.replace(",", "."))
}

module.exports = {
    limpaPrecos
}