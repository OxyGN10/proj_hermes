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

export const gerarJSON = async (colecNome: string, chaveAnt: number = 0): Promise<number> => {
    const colecMeta: ColecMeta[] = await getColecMeta();

    for(let colec of colecMeta) 
    {
        if(colec.nome == colecNome && colec.quadChaves.length < colec.largura) {
            const chavef: number = chaveAnt + 1;    
            await Deno.writeTextFile(path.join(__dirname, `${colecNome}_dados.json`, `dados[${chavef}]`), JSON.stringify({ chave: chavef, disp: colec.altura }, null, 4));

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
        let dados: any = JSON.parse(await Deno.readTextFile(path.join(caminhos.colecPasta, colec.ultArq)));
        
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

export const formatReg = (arr: Dados[], idx = 0, res: any = {}): any => {
    if(idx == arr.length)
        return res;

    const item = arr[idx];

    if(item && item.atributo)
        res[item.atributo] = item.valor;

    return formatReg(arr, idx+1, res);
}

//Área de teste
/*const AppTeste = async (): Promise<void> => {
    const colecTeste = new Colecao("colecteste", 5, 3);

    try {
        //await colecTeste.init();
        //console.log(`A coleção ${colecTeste.getNome()} foi criada com sucesso!`);
        //await colecTeste.rem_colec();
        //console.log(`Coleção removida com sucesso!`);
    }
    catch(err) {
        if(err instanceof Error)
            console.error(`Erro: ${err.message}`);
    }
}*/

const AppTeste = (): void => {
    const dados: {
        nome: string,
        idade: number,
        maior: true
    } = {
        nome: "Felipe Eugênio",
        idade: 25,
        maior: true
    }

    const dadosf: Dados[] = formatDados(dados);
    const dadosi: any = formatReg(dadosf);

    console.log(dadosf);
    console.log(dadosi);
}

AppTeste();