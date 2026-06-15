import * as path from "@std/path";
import { ColecMeta, __dirname, Dados, Registro } from "./auxTipos.ts";

export const getColecMeta = async (): Promise<ColecMeta[]> => {
    const caminho: string = path.join(__dirname, "colecMeta.json");
    const colecMeta: ColecMeta[] = JSON.parse(await Deno.readTextFile(caminho));

    return colecMeta;
}

export const alterColec = async (colecNome: string, dados: ColecMeta): Promise<void> => {
    let colecMeta: ColecMeta[] = await getColecMeta();

    for(let i: number = 0; i < colecMeta.length; i++) {
        if(colecMeta[i].nome == colecNome) {
            colecMeta[i] = dados;
            await Deno.writeTextFile(path.join(__dirname, "colecMeta.json"), JSON.stringify(colecMeta, null, 4));
            return;
        }
    }

    throw new Error("A coleção não existe!");
}

export const colecExiste = async (colecNome: string): Promise<boolean> => {
    const colecMeta: ColecMeta[] = await getColecMeta();

    for(const colec of colecMeta) {
        if(colec.nome == colecNome)
            return true;
    }

    return false;
}

export const gerarJSON = async (colecNome: string, chaveAnt: number = -1): Promise<number> => {
    const colecMeta: ColecMeta[] = await getColecMeta();

    for(let colec of colecMeta) 
    {
        if(colec.nome == colecNome && colec.quadChaves.length < colec.largura) {
            const chavef: number = chaveAnt + 1;    
            await Deno.writeTextFile(path.join(__dirname, `${colecNome}_dados`, `dados[${chavef}].json`), JSON.stringify([{ chave: chavef, disp: colec.altura }], null, 4));

            return chavef;
        }
        else if(colec.nome == colecNome && colec.quadChaves.length >= chaveAnt)
            throw new Error("A coleção está cheia, não é possível acrescentar novas chaves");
    }

    throw new Error("Nome inválido de coleção ou não existe");
}

export const getChave = async (colecNome: string): Promise<number> => {
    let ultChave: number;
    const caminhos: { colecMeta: string, colecPasta: string } = {
        colecMeta: path.join(__dirname, "colecMeta.json"),
        colecPasta: path.join(__dirname, `${colecNome}_dados`)
    };

    const colecMeta: ColecMeta[] = await getColecMeta();
    const colec = colecMeta.find(colecao => colecao.nome == colecNome);

    if(!colec)
        throw new Error("Coleção não encontrada");

    while(true)
    {
        let dados: any[] = JSON.parse(await Deno.readTextFile(path.join(caminhos.colecPasta, colec.ultArq)));

        if(dados[0].disp > 0)
            return dados[0].chave;

        if(dados[0].chave > colec.largura)
            throw new Error("Quantidade máxima de chaves alcançada!");

        ultChave = await gerarJSON(colecNome, dados[0].chave);
        
        colec.quadChaves.push(ultChave);
        colec.ultArq = `dados[${ultChave}].json`;

        await alterColec(colecNome, colec);
    }
}

export const getPos = async (colecNome: string): Promise<number> => {
    const colecMeta: ColecMeta[] = await getColecMeta();

    for(let colec of colecMeta) {
        if(colec.nome == colecNome) {
            const ultChave: Array<any> = JSON.parse(await Deno.readTextFile(path.join(__dirname, `${colecNome}_dados`, colec.ultArq)));
            
            for(let j: number = 1; j < colec.altura; j++) {
                if(!ultChave[j])
                    return j;
            }
        }
    }

    throw new Error("Coleção não encontrada");
}

export const getDadosArq = async (colecNome: string, chave: number): Promise<any[]> => {
    const caminho: string = path.join(__dirname, `${colecNome}_dados`, `dados[${chave}].json`);
    const dadosArq: any[] = JSON.parse(await Deno.readTextFile(caminho));
    
    return dadosArq;
}

export const formatDados = (dados: any): Dados[] => {
    const atributos: string[] = Object.keys(dados);
    const valores: any[] = Object.values(dados);
    let dadosf: Dados[] = [];

    for(let i: number = 0; i < atributos.length; i++) {
        dadosf.push({
            atributo: atributos[i],
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