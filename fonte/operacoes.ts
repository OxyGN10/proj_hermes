import * as path from "@std/path";
import { /*alterColec,*/ colecExiste, getColecMeta, gerarJSON } from "./auxfuncs.ts";
import { ColecMeta, __dirname } from "./auxTipos.ts";

class Colecao
{
    protected colecNome: string;
    protected altura: number;
    protected largura: number;
    protected quadChaves: number[];

    constructor(nome: string, altura: number, largura: number) {
        this.colecNome = nome;
        this.altura = altura;
        this.largura = largura;
        this.quadChaves = [];
    }

    async init(): Promise<void> {
        if(await colecExiste(this.colecNome))
            throw new Error("Já existe uma coleção com esse nome, modifique o nome e tente novamente!");

        const colecMetaDados: ColecMeta = {
            nome: this.colecNome,
            altura: this.altura,
            largura: this.largura,
            ultArq: "dados[0].json",
            quadChaves: [0]
        }
    
        let colecMeta: ColecMeta[] = await getColecMeta();
        colecMeta.push(colecMetaDados);
        
        await Deno.mkdir(path.join(__dirname, `${this.colecNome}_dados`));        
        await Deno.writeTextFile(path.join(__dirname, "colecMeta.json"), JSON.stringify(colecMeta, null, 4));
        await gerarJSON(this.colecNome);
    }

    async rem_colec(): Promise<void> {
        if(!(await colecExiste(this.colecNome)))
            throw new Error("Não existe uma coleção com esse nome, modifique o nome e tente novamente!");

        let colecMeta: ColecMeta[] = await getColecMeta();
        const idx: number = colecMeta.findIndex(colec => colec.nome == this.colecNome);

        colecMeta.splice(idx, 1);
        await Deno.writeTextFile(path.join(__dirname, "colecMeta.json"), JSON.stringify(colecMeta, null, 4));
        await Deno.remove(path.join(__dirname, `${this.colecNome}_dados`), { recursive: true });
    }

    getNome(): string {
        return this.colecNome;
    }
}


//Área de teste
const AppTeste = async (): Promise<void> => {
    const colecTeste = new Colecao("colecteste", 5, 3);

    try {
        await colecTeste.init();
        console.log(`A coleção ${colecTeste.getNome()} foi criada com sucesso!`);
        //await colecTeste.rem_colec();
        //console.log(`Coleção removida com sucesso!`);
    }
    catch(err) {
        if(err instanceof Error)
            console.error(`Erro: ${err.message}`);
    }
}

AppTeste();