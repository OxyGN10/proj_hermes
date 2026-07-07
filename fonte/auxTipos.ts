import process from "node:process";
import { join } from "node:path";

export const dirRaiz: string = join(process.cwd(), "hermes_src");

export interface ColecMeta {
    nome: string;
    altura: number;
    largura: number;
    quadChaves: Array<number>;
    disp: number
}

export interface RegMeta {
    chave: number;
    pos: number;
}

export interface Dados {
    atributo: string;
    valor: string | number | boolean;
}

export interface Registro {
    localizador: string;
    dados: Array<Dados> | null;
}