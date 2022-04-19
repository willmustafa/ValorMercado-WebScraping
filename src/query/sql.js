const pg = require('pg');
const path = require('path');
const fs = require('fs');

let dbconfig = '';
(async () => {
    try {
        dbconfig = JSON.parse(await fs.readFileSync(path.join(__dirname, "../../docs/dbconfig.json"), 'utf-8'));
    } catch (error) {
        console.log("Banco de dados não configurado");
        const prompt = require('prompt-sync')();

        const resposta = prompt('Quer configurar o banco de dados? Y/n: ');
        if (resposta == 'Y' || resposta == 'y') {
            dbconfig = {
                url: prompt('url com ip do banco de dados postgres (exemplo: localhost:5432): '),
                user: prompt('usuário: '),
                database: prompt('nome do database: ')
            };
            console.log('Testando conexão...');
            const pgTest = await new pg.Client(`postgres://postgres:${dbconfig.user}@${dbconfig.url}/${dbconfig.database}`);
            console.log("Conexão executada com sucesso. Gravando arquivo...");
            await fs.writeFileSync(path.join(__dirname, "../../docs/dbconfig.json"), JSON.stringify(dbconfig));
            console.log("Configuração salva.");
            console.log("Criando Esquemas e tabelas;");

            await pgTest.query(`
            BEGIN;
            CREATE TABLE public.historico (
                id integer NOT NULL,
                produto_completo text NOT NULL,
                valor real NOT NULL,
                href text NOT NULL,
                id_marca integer,
                id_mercado integer NOT NULL,
                id_produto integer NOT NULL,
                id_unidade integer NOT NULL,
                data date NOT NULL,
                quantidade real
            );
            ALTER TABLE public.historico OWNER TO postgres;
            CREATE SEQUENCE public.historico_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.historico_id_seq OWNER TO postgres;
ALTER SEQUENCE public.historico_id_seq OWNED BY public.historico.id;
CREATE TABLE public.marcas (
    id integer NOT NULL,
    marca text NOT NULL
);


ALTER TABLE public.marcas OWNER TO postgres;
CREATE SEQUENCE public.marcas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.marcas_id_seq OWNER TO postgres;
ALTER SEQUENCE public.marcas_id_seq OWNED BY public.marcas.id;
CREATE TABLE public.mercado (
    id integer NOT NULL,
    mercado text NOT NULL
);


ALTER TABLE public.mercado OWNER TO postgres;
CREATE SEQUENCE public.mercado_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mercado_id_seq OWNER TO postgres;
ALTER SEQUENCE public.mercado_id_seq OWNED BY public.mercado.id;
CREATE TABLE public.produtos (
    id integer NOT NULL,
    produto text NOT NULL
);


ALTER TABLE public.produtos OWNER TO postgres;
CREATE SEQUENCE public.produtos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.produtos_id_seq OWNER TO postgres;
ALTER SEQUENCE public.produtos_id_seq OWNED BY public.produtos.id;
CREATE TABLE public.unidades (
    id integer NOT NULL,
    unidade text NOT NULL
);


ALTER TABLE public.unidades OWNER TO postgres;
CREATE SEQUENCE public.unidades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.unidades_id_seq OWNER TO postgres;
ALTER SEQUENCE public.unidades_id_seq OWNED BY public.unidades.id;
ALTER TABLE ONLY public.historico ALTER COLUMN id SET DEFAULT nextval('public.historico_id_seq'::regclass);
ALTER TABLE ONLY public.marcas ALTER COLUMN id SET DEFAULT nextval('public.marcas_id_seq'::regclass);
ALTER TABLE ONLY public.mercado ALTER COLUMN id SET DEFAULT nextval('public.mercado_id_seq'::regclass);
ALTER TABLE ONLY public.produtos ALTER COLUMN id SET DEFAULT nextval('public.produtos_id_seq'::regclass);
ALTER TABLE ONLY public.unidades ALTER COLUMN id SET DEFAULT nextval('public.unidades_id_seq'::regclass);

SELECT pg_catalog.setval('public.marcas_id_seq', 52, true);
SELECT pg_catalog.setval('public.mercado_id_seq', 5, true);
SELECT pg_catalog.setval('public.unidades_id_seq', 9, true);
ALTER TABLE ONLY public.historico
    ADD CONSTRAINT historico_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY public.marcas
    ADD CONSTRAINT marcas_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY public.mercado
    ADD CONSTRAINT mercado_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY public.produtos
    ADD CONSTRAINT produtos_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY public.unidades
    ADD CONSTRAINT unidades_pkey PRIMARY KEY (id);
    ALTER TABLE ONLY public.historico
    ADD CONSTRAINT historico_id_marca_fkey FOREIGN KEY (id_marca) REFERENCES public.marcas(id);
    ALTER TABLE ONLY public.historico
    ADD CONSTRAINT historico_id_mercado_fkey FOREIGN KEY (id_mercado) REFERENCES public.mercado(id);
    ALTER TABLE ONLY public.historico
    ADD CONSTRAINT historico_id_produto_fkey FOREIGN KEY (id_produto) REFERENCES public.produtos(id);
    ALTER TABLE ONLY public.historico
    ADD CONSTRAINT historico_id_unidade_fkey FOREIGN KEY (id_unidade) REFERENCES public.unidades(id);

    COMMIT;
            `)
        } else {
            stop;
        }
    }

})()

console.log(dbconfig);
const pgClient = new pg.Client(`postgres://postgres:${dbconfig.user}@${dbconfig.url}/mercados`);
const clean = require('../cleaning/wordCleaning')

try {
    pgClient.connect();
} catch (error) {
    console.log(`Falhou em inserir algo: ${error}`)
}

async function inserirBD(dados) {
    for (let i = 0; i < dados.length; i++) {
        try {
            // Adiciona o produto
            await pgClient.query(`do $$
                BEGIN
                IF NOT EXISTS (SELECT * FROM public.produtos WHERE produtos.produto = '${dados[i][5]}') THEN
                INSERT INTO public.produtos (produto) VALUES ('${dados[i][5]}');
                END IF;
                END;
                $$`);

            // adiciona tudo
            var query = await pgClient.query(`do $$
                BEGIN
                IF NOT EXISTS (SELECT * FROM public.historico 
                    WHERE historico.produto_completo = '${dados[i][2]}' 
                    AND historico.valor = '${dados[i][3]}' 
                    AND historico.data = '${dados[i][0]}' 
                    AND historico.id_marca = (SELECT id FROM public.marcas WHERE marcas.marca = '${dados[i][6]}')
                    AND historico.id_mercado = (SELECT id FROM public.mercado WHERE mercado.mercado = '${dados[i][1]}') ) THEN
                INSERT INTO public.historico (produto_completo, valor, href, data, quantidade, id_marca, id_mercado, id_produto, id_unidade) 
                VALUES ('${dados[i][2]}', '${dados[i][3]}', '${dados[i][4]}', '${dados[i][0]}', '${dados[i][8]}',
                    (SELECT id FROM public.marcas WHERE marcas.marca = '${dados[i][6]}'),
                    (SELECT id FROM public.mercado WHERE mercado.mercado = '${dados[i][1]}'),
                    (SELECT id FROM public.produtos WHERE produtos.produto = '${dados[i][5]}'),
                    (SELECT id FROM public.unidades WHERE unidades.unidade = '${dados[i][7]}')
                    ); 
                END IF;
                END;
                $$`);

        } catch (err) {
            console.log(`Falhou em inserir algo: ${err}`)
        }

    }

    pgClient.end();
    console.log("Banco de dados inserido com sucesso.")

}

async function gravarBD(array) {
    let dataHoje = new Date().toLocaleString('pt-BR', {
        dateStyle: 'short'
    });

    let stringQuery = [];

    for (let i = 0; i < array.length; i++) {
        let mercado = array[i][0];
        for (let k = 0; k < array[i][1].length; k++) {
            const titulo = array[i][1][k][0];
            const valor = array[i][1][k][1];
            const href = array[i][1][k][2];
            const tituloSeparado = await clean.separaDados(titulo);
            stringQuery.push([dataHoje, mercado, titulo, valor, href, tituloSeparado[1], tituloSeparado[2], tituloSeparado[3], tituloSeparado[4] == '' ? '1' : tituloSeparado[4]]);
        }
    }
    await inserirBD(stringQuery);
}

async function getMarcas() {
    try {
        var query = await pgClient.query({
            text: "SELECT marca FROM public.marcas;",
            rowMode: 'array'
        });
        return query.rows.flat();
    } catch (error) {
        console.log(`Falhou em inserir algo: ${error}`)
    }
}

async function getUnidades() {
    try {
        var query = await pgClient.query({
            text: "SELECT unidade FROM public.unidades;",
            rowMode: 'array'
        });
        return query.rows.flat();
    } catch (error) {
        console.log(`Falhou em inserir algo: ${error}`)
    }
}






module.exports.gravarBD = gravarBD;
module.exports.getMarcas = getMarcas;
module.exports.getUnidades = getUnidades;
module.exports.end = async function end() {
    await pgClient.end();
};