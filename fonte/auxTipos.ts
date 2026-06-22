// deno-lint-ignore-file no-explicit-any
export const __dirname: string = Deno.cwd();

export interface ColecMeta {
    nome: string;
    altura: number;
    largura: number;
    quadChaves: number[];
    ultArq: string;
}

export interface Dados {
    atributo: string;
    valor: string | number | boolean;
}

export interface Registro {
    localizador: string;
    dados: Dados[];
}

export interface h_params {
    colecNome?: string,
    localizador?: string,
    altura?: number,
    largura?: number,
    dados?: any,
    dadosBusca?: Dados
}

export enum Modos {
    iniciar_colec,
    remover_colec,
    salvar_dados,
    remover_dados,
    buscar_dados,
    buscar_dados_it,
}
