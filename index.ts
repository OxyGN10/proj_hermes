import * as fs from "node:fs/promises";
import * as path from "node:path";
import { type ColecMeta, dirRaiz, type Registro, type Dados, type RegMeta } from "./fonte/auxTipos";
import { colecExiste, gerarJSON, getColecMeta, getRegMeta, formatDados, getDadosArq, formatReg } from "./fonte/auxfuncs";

type n_opcional = number | null;

/**
 * Classe que manipula dados e coleções
 * @author: OxyGN10
 */
export class Hermes
{
    /**Nome da coleção */
    protected colecNome: string;
    /**Limite de registros por arquivo */
    protected altura?: n_opcional;
    /**Limite de arquivos por coleção */
    protected largura?: n_opcional;
    /**Índice de chaves presente na coleção */
    protected quadChaves: Array<number>;

    /**
     * Determina os metadados de coleção
     * @param nome nomeclatura da coleção (obrigatório, único)
     * @param altura limite de registros por aquivo na coleção (opcional)
     * @param largura limite de arquivos da coleção (opcional)
     */
    constructor(nome: string, altura?: number, largura?: number) {
        this.colecNome = nome;
        this.quadChaves = new Array();

        if(altura && largura) {
            this.altura = altura;
            this.largura = largura;
        }
    }

    /**
     * Inicializa a coleção, cria o diretório em que os arquivos serão criados
     * @throws Caso a coleção já esteja registrada em colecMeta.json, o programa retorna erro, pois não podem haver duas coleções com o mesmo nome
     * @throws Os atributos altura e largura são obrigatórios para a inicialização, pois determinam os limites de crescimento da coleção
     */
    async init(): Promise<void> {
        if(await colecExiste(this.colecNome))
            throw new Error("Já existe uma coleção com esse nome, modifique o nome e tente novamente!");

        if(!this.altura || !this.largura)
            throw new Error("Altura e largura são obrigatórios para inicializar uma coleção")
        
        const colecMetaDados: ColecMeta = {
            nome: this.colecNome,
            altura: this.altura,
            largura: this.largura,
            disp: this.largura - 1,
            quadChaves: [0]            
        };

        let colecMeta: Array<ColecMeta> = await getColecMeta();
        colecMeta.push(colecMetaDados);

        await fs.mkdir(path.join(dirRaiz, `${this.colecNome}_dados`));
        await fs.writeFile(path.join(dirRaiz, "colecMeta.json"), JSON.stringify(colecMeta, null, 4));
        await gerarJSON(this.colecNome);
    }

    /**
     * Captura os dados da coleção e preenche os atributos do objeto, referência obrigatória para uso em funções de inserção e busca iterativa, este método itera sobre o array presente em colecMeta.json, ao encontrar um regstro com o mesmo nome do objeto instanciado, preenche os atributos, e imediatamente interrompe a execução.
     * @throws Caso a iteração encerre (isto é não encontre uma referência), um erro é lançado apontando que o nome está incorreto ou a coleção não existe.
     */
    async getColec(): Promise<void> {
        const colecMeta: Array<ColecMeta> = await getColecMeta();

        for(const colec of colecMeta) {
            if(colec.nome == this.colecNome) {
                this.altura = colec.altura;
                this.largura = colec.largura;
                this.quadChaves = colec.quadChaves;

                return;
            }
        }

        throw new Error("Nome de coleção incorreto ou coleção inexistente");
    }

    /**Remove a Coleção */
    async rm(): Promise<void> {
        if(!(await colecExiste(this.colecNome)))
            throw new Error("Não há uma coleção com esse nome, modifique o nome e tente novamente!");

        let colecMeta: Array<ColecMeta> = await getColecMeta();
        const idx: number = colecMeta.findIndex(colec => colec.nome == this.colecNome);

        colecMeta.splice(idx, 1);
        await fs.writeFile(path.join(dirRaiz, "colecMeta.json"), JSON.stringify(colecMeta, null, 4));
        await fs.rm(path.join(dirRaiz, `${this.colecNome}_dados`), { recursive: true });
    }

    /**
     * Insere dados na última chave disponível da coleção, se não houver, criará uma nova chave e fará a inserção nesta nova chave
     * @throws Caso a quantidade de chaves seja igual a largura da coleção (isto é, o limite de arquivos), o programa lança erro impedindo a operação
     * @returns Metadados de registro (localizador)
     */
    async inserir_dados(dados: any): Promise<string> {
        const regMeta: RegMeta = await getRegMeta(this.colecNome);

        const reg: Registro = {
            localizador: `${this.colecNome.slice(0, 6)}.${regMeta.chave}.${regMeta.pos}`,
            dados: formatDados(dados)
        }

        let dadosArq: Array<any> = await getDadosArq(this.colecNome, regMeta.chave);

        dadosArq[regMeta.pos] = reg;
        dadosArq[0].disp--;

        await fs.writeFile(path.join(dirRaiz, `${this.colecNome}_dados`, `dados[${regMeta.chave}].json`), JSON.stringify(dadosArq, null, 4));

        return reg.localizador;
    }

    /** 
     * Remove os dados presentes no localizador especificado 
     * @param localizador Metadados de registro que aponta para uma posição específica na coleção;
     */
    async rm_dados(localizador: string): Promise<void> {
        const loc: Array<string> = localizador.split(".");

        const regMeta: RegMeta = { chave: parseInt(loc[1] ?? ""), pos: parseInt(loc[2] ?? "") };
        const caminho: string = path.join(dirRaiz, `${this.colecNome}_dados`, `dados[${regMeta.chave}].json`);
        let dados: Array<any> = JSON.parse(await fs.readFile(caminho, "utf-8"));

        dados[regMeta.pos].dados = null
        dados[0].disp++;
        
        await fs.writeFile(caminho, JSON.stringify(dados, null, 4));
    }

    /**
     * Busca diretamente os dados no localizador especificado
     * @param localizador Metadados de registro que aponta para uma posição específica na coleção;
     * @returns dados em formato JS object
     */
    async dr_busca(localizador: string): Promise<any> {
        const loc: Array<string> = localizador.split(".");

        const regMeta: RegMeta = { chave: parseInt(loc[1] ?? ""), pos: parseInt(loc[2] ?? "") };
        const dados: Array<any> = JSON.parse(await fs.readFile(path.join(dirRaiz, `${this.colecNome}_dados`, `dados[${regMeta.chave}].json`), "utf-8"));
        
        return { localizador: dados[regMeta.pos].localizador, ...formatReg(dados[regMeta.pos].dados) };
    }

    /**
     * Realiza a busca dos dados a partir de um atributo e valor especificado
     * @param campo definido em { atributo: string, valor: string | number | boolean }
     * @returns dados em formato JS object
     * @throws lança erro se todos os registros forem analisados e nenhum corresponder ao procurado
     */
    async it_busca(campo: Dados): Promise<any[]> {
        let i: number = 0;
        let j: number = 1;
        let dadosi: Array<any> = [];

        while(true)
        {
            if(i >= this.quadChaves.length)
                break;

            const caminho: string = path.join(dirRaiz, `${this.colecNome}_dados`, `dados[${i}].json`);
            const chave: Array<any> = JSON.parse(await fs.readFile(caminho, "utf-8"));

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
            throw new Error(`O valor '${campo.valor}' sob o atributo '${campo.atributo}' não foi encontrado!`);

        return dadosi;
    }

    /**
     * Realiza a remoção do registro em campo com atributo e valor especificado
     * @param campo definido em { atributo:string, valor: string | number | boolean }
     */
    async it_rmDados(campo: Dados): Promise<void> {
        const registro: Array<any> = await this.it_busca(campo);

        for(const reg of registro) {    
            await this.rm_dados(reg.localizador);
        }
    }
}