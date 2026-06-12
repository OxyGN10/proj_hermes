import { dirname, fromFileUrl } from "@std/path";

export const __dirname: string = dirname(fromFileUrl(import.meta.url));

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