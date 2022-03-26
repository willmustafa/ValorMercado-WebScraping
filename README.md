# ValorMercado-WebScraping
 Procura o valor de produtos de mercado, baseado em uma lista de produtos, ou em uma lista de links, fornecidos pelo usuário em um arquivo txt.
 O resultado é salvo em um arquivo json e em um banco de dados postgres local.

 Utiliza NodeJs e o plugin puppeteer para fazer as consultas e progress para mapear %.

 2 opções de consultas:
 - Via nome dos produtos;
 - Via links fornecidos;

 Implementações futuras:
 [X] Salvar em um banco de dados local
 [ ] Salvar em um Google Sheets
 [ ] Maiores interações pelo usuário