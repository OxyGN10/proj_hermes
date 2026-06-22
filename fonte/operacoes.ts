// deno-lint-ignore-file prefer-const no-explicit-any
import * as path from "@std/path";
import { colecExiste, getColecMeta, gerarJSON, getChave, getPos, formatDados, getDadosArq, formatReg } from "./auxfuncs.ts";
import { ColecMeta, __dirname, Dados, Registro } from "./auxTipos.ts";

export class Colecao
{
    protected colecNome: string;
    protected altura?: number | null;
    protected largura?: number | null;
    protected quadChaves: number[];

    constructor(nome: string, altura?: number, largura?: number) {
        this.colecNome = nome;
        this.quadChaves = [];        
        
        if(altura && largura) {
            this.altura = altura;
            this.largura = largura;
        }
    }

    async getColec(): Promise<void> {
        const colecs: ColecMeta[] = await getColecMeta();

        for(let colec of colecs) {
            if(colec.nome == this.colecNome) {
                this.colecNome = colec.nome;
                this.altura = colec.altura;
                this.largura = colec.largura;
                this.quadChaves = colec.quadChaves;

                return;
            }

            throw new Error(`Coleção ${this.colecNome} não encontrada!`);
        }
    }

    async init(): Promise<void> {
        if(await colecExiste(this.colecNome))
            throw new Error("Já existe uma coleção com esse nome, modifique o nome e tente novamente!");

        if(!this.altura || !this.largura)
            throw new Error("Altura e largura são obrigatórios para inicializar uma coleção")

        const colecMetaDados: ColecMeta = {
            nome: this.colecNome,
            altura: this.altura,
            largura: this.largura,
            ultArq: "dados[0].json",
            quadChaves: [0]
        }
    
        let colecMeta: ColecMeta[] = await getColecMeta();
        colecMeta.push(colecMetaDados);
        
        await Deno.mkdir(path.join(__dirname, "hermes_src",`${this.colecNome}_dados`));        
        await Deno.writeTextFile(path.join(__dirname, "hermes_src", "colecMeta.json"), JSON.stringify(colecMeta, null, 4));
        await gerarJSON(this.colecNome);
    }

    async rem_colec(): Promise<void> {
        if(!(await colecExiste(this.colecNome)))
            throw new Error("Não existe uma coleção com esse nome, modifique o nome e tente novamente!");

        let colecMeta: ColecMeta[] = await getColecMeta();
        const idx: number = colecMeta.findIndex(colec => colec.nome == this.colecNome);

        colecMeta.splice(idx, 1);
        await Deno.writeTextFile(path.join(__dirname, "hermes_src", "colecMeta.json"), JSON.stringify(colecMeta, null, 4));
        await Deno.remove(path.join(__dirname, "hermes_src", `${this.colecNome}_dados`), { recursive: true });
    }

    async insert_dados(dados: any): Promise<void> {
        const chave: number = await getChave(this.colecNome);
        const pos: number = await getPos(this.colecNome);

        const reg: Registro = {
            localizador: `${this.colecNome.slice(0, 6)}.${chave}.${pos}`,
            dados: formatDados(dados)
        }

        let dadosArq: any[] = await getDadosArq(this.colecNome, chave);
        
        dadosArq.push(reg);
        dadosArq[0].disp--;

        await Deno.writeTextFile(path.join(__dirname, "hermes_src", `${this.colecNome}_dados`, `dados[${chave}].json`), JSON.stringify(dadosArq, null, 4));
    }

    async busca_direta(localizador: string): Promise<any> {
        await this.getColec();

        const loc: Array<string> = localizador.split(".");
        
        const chave: number = parseInt(loc[1]);
        const pos: number = parseInt(loc[2]);

        console.log(`Chave: ${chave} | pos: ${pos}`);

        const dados: any[] = JSON.parse(await Deno.readTextFile(path.join(__dirname, "hermes_src", `${this.colecNome}_dados`, `dados[${chave}].json`)));
    
        return { localizador: dados[pos].localizador, ...formatReg(dados[pos].dados) };
    }

    async busca_iterativa(campo: Dados): Promise<any[]> {
        await this.getColec();

        let i: number = 0;
        let j: number = 1;
        let dadosi: Array<any> = [];

        while(true)
        {
            if(i >= this.quadChaves.length)
                break;

            const caminho: string = path.join(__dirname, "hermes_src", `${this.colecNome}_dados`, `dados[${i}].json`);
            const chave: Array<any> = JSON.parse(await Deno.readTextFile(caminho));

            if(j >= chave.length) {
                i++;
                j = 1;
                continue;
            }

            for(let dado of chave[j].dados) {
                if(dado.atributo == campo.atributo && dado.valor == campo.valor) {
                    dadosi.push({ localizador: chave[j].localizador, ...formatReg(chave[j].dados) });
                }
            }

            j++;
        }

        if(dadosi.length == 0)
            throw new Error(`O valor ${campo.valor} sob o atributo ${campo.atributo} não foi encontrado!`);

        return dadosi;
    }

    async rem_dados(localizador: string): Promise<void> {
        await this.getColec();

        const loc: Array<string> = localizador.split(".");
        
        const chave: number = parseInt(loc[1]);
        const pos: number = parseInt(loc[2]);
        const caminho: string = path.join(__dirname, "hermes_src", `${this.colecNome}_dados`, `dados[${chave}].json`);
        const dados: Array<any> = JSON.parse(await Deno.readTextFile(caminho));        

        dados.splice(pos, 1);
        await Deno.writeTextFile(caminho, JSON.stringify(dados, null, 4));
    }

    getNome(): string {
        return this.colecNome;
    }
}