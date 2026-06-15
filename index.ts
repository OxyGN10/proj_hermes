// deno-lint-ignore-file no-explicit-any
import { Colecao } from "./fonte/operacoes.ts";
import { Modos, h_params } from "./fonte/auxTipos.ts";

export const Hermes = async (modo: Modos, params: h_params): Promise<any> => {
    let colec: Colecao;
    
    switch(modo)
    {
        case Modos.iniciar_colec:
            if(params.colecNome && params.altura && params.largura) {
                colec = new Colecao(params.colecNome, params.altura, params.largura);
                await colec.init();

                return true;
            }

            return false;

        case Modos.remover_colec:
            if(params.colecNome) {
                colec = new Colecao(params.colecNome);
                await colec.rem_colec();

                return true;
            }

            return false;

        case Modos.salvar_dados:
            if(params.colecNome) {
                colec = new Colecao(params.colecNome);
                await colec.insert_dados(params.dados);
                
                return true;
            }

            return false;

        case Modos.remover_dados:
            if(params.colecNome && params.localizador) {
                colec = new Colecao(params.colecNome);
                await colec.rem_dados(params.localizador);
                console.log(`Os dados foram removidos com sucesso!`);

                return true;
            }
            
            return false;

        case Modos.buscar_dados:
            if(params.colecNome && params.localizador) {
                colec = new Colecao(params.colecNome);

                return await colec.busca_direta(params.localizador);
            }
            return false;

        case Modos.buscar_dados_it:
            if(params.colecNome && params.dadosBusca) {
                colec = new Colecao(params.colecNome);
                
                return await colec.busca_iterativa({ atributo: params.dadosBusca.atributo, valor: params.dadosBusca.valor });
            }
            return false;

        default:
            throw new Error("Modo Inválido!");
    }
}

export { Modos };