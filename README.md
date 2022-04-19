# ValorMercado-WebScraping
 Procura o valor de produtos de mercado, baseado em uma lista de produtos, ou em uma lista de links, fornecidos pelo usuário em um arquivo txt.
 O resultado é salvo em um arquivo json

 Utiliza NodeJs e o plugin puppeteer para fazer as consultas.

 Implementações futuras:
 [ ] Destrinchar string do título para dividir entre produto, marca, unidade
 [ ] Salvar em um banco de dados local
 [ ] Salvar em um Google Sheets
 [ ] Maiores interações pelo usuário
 [ ] Front-End

# Utilização
 
 Para utilizar o software, liste os produtos que quer pesquisar no arquivo em ```docs/searchFor/searchFor.txt```;

 Após isso, utilize o comando abaixo:

 ```
 npm run
 ```

# Nota da Versão

 - Projeto refatorado completamente.
 - Retirado opção de pesquisa por link, os sites não mantém o mesmo link para os produtos, sempre estão alterando, o que torna essa opção irrelevante.