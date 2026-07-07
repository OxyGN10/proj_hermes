import * as fs from "node:fs/promises";
import * as path from "node:path";
import { type ColecMeta, type Dados, dirRaiz, type RegMeta } from "./auxTipos";

export const getColecMeta = async (): Promise<ColecMeta[]> => {
    const caminho: string = path.join(dirRaiz , "colecMeta.json");
    
    try {
        await fs.access(caminho);
    }
    catch {
        await defAmbiente();
    }

    const colecMeta: Array<ColecMeta> = JSON.parse(await fs.readFile(caminho, "utf-8"));

    return colecMeta;    
}

export const colecExiste = async (colecNome: string): Promise<boolean> => {
    const colecMeta: Array<ColecMeta> = await getColecMeta();

    for(const colec of colecMeta) {
        if(colec.nome == colecNome)
            return true;
    }

    return false;
}

export const defAmbiente = async (): Promise<void> => {
    const caminho: string = path.join(dirRaiz, "colecMeta.json");
    await fs.mkdir(dirRaiz)
    await fs.writeFile(caminho, JSON.stringify([]), "utf-8");
}

export const gerarJSON = async (colecNome: string, chave: number = 0): Promise<number> => {
    const colecMeta: Array<ColecMeta> = await getColecMeta();

    for(let colec of colecMeta) 
    {
        if(colec.nome == colecNome && colec.quadChaves.length < colec.largura) {
            await fs.writeFile(path.join(dirRaiz, `${colecNome}_dados`, `dados[${chave}].json`), JSON.stringify([{ chave: chave, disp: colec.altura }], null, 4));

            return chave;
        }
        else if(colec.nome == colecNome && colec.quadChaves.length >= chave)
            throw new Error("A coleção está cheia, não é possível acrescentar novas chaves");
    }

    throw new Error("Nome de coleção incorreto ou coleção inexistente");
}

export const formatDados = (dados: any): Array<Dados> => {
    const atributos: Array<string> = Object.keys(dados);
    const valores: Array<any> = Object.values(dados);
    let dadosf: Array<Dados> = new Array();

    for(let i: number = 0; i < atributos.length; i++) {
        if(!atributos[i])
            throw new Error();

        dadosf.push({
            atributo: atributos[i] ?? "",
            valor: valores[i]
        });
    }

    return dadosf;
}

export const formatReg = (arr: Array<Dados>): Record<string, any> => {
    let dadosi: Record<string, any> = {};

    for(let dado of arr) {
        if(dado?.atributo) {
            if(dado.atributo in dadosi) {
                console.warn(`Atributo duplicado: ${dado.atributo}`);
            }

            dadosi[dado.atributo] = dado.valor;
        }
    }

    return dadosi;
}

export const alterColec = async (colecNome: string, dados: ColecMeta): Promise<void> => {
    let colecMeta: Array<ColecMeta> = await getColecMeta();

    for(let i: number = 0; i < colecMeta.length; i++) {
        if(colecMeta[i]?.nome == colecNome) {
            colecMeta[i] = dados;
            await fs.writeFile(path.join(dirRaiz, "colecMeta.json"), JSON.stringify(colecMeta, null, 4));
            return;
        }
    }

    throw new Error("A coleção não existe!");
}

export const getRegMeta = async (colecNome: string): Promise<RegMeta> => {
    let caminho: string;
    let dados: Array<any> = new Array();

    const caminhos: { colecMeta: string, colecPasta: string } = {
        colecMeta: path.join(dirRaiz, "colecMeta.json"),
        colecPasta: path.join(dirRaiz, `${colecNome}_dados`)
    };

    const colecMeta: Array<ColecMeta> = await getColecMeta();
    const colec = colecMeta.find(colecao => colecao.nome == colecNome);

    if(!colec)
        throw new Error("Coleção não encontrada");

    for(let chave of colec.quadChaves) 
    {
        caminho = path.join(caminhos.colecPasta, `dados[${chave}].json`);
        dados = JSON.parse(await fs.readFile(caminho, "utf-8"));

        for(let i = 1; i <= colec.altura; i++) {
            if(!dados[i] || dados[i].dados == null)
                return { chave: chave, pos: i };
        }
    }
    
    if(colec.disp == 0)
        throw new Error("Quantidade máxima de chaves alcançada!");

    
    let novaChave: number = await gerarJSON(colecNome, colec.quadChaves.length);
    colec.quadChaves.push(novaChave);
    await alterColec(colecNome, colec);
    
    return { chave: novaChave, pos: 1 };
}

export const getDadosArq = async (colecNome: string, chave: number): Promise<any[]> => {
    const caminho: string = path.join(dirRaiz, `${colecNome}_dados`, `dados[${chave}].json`);
    const dadosArq: Array<any> = JSON.parse(await fs.readFile(caminho, "utf-8"));
    
    return dadosArq;
}