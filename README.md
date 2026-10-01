# proj_hermes
Projeto Hermes

[📜Memorando](memorandum.md)

## Apresentação

O Projeto Hermes (antigo IODJSON) é uma interface de manipulação de dados persistentes em nível de aplicação, o projeto se propõe a ser uma alternativa ao SQLite como uma solução moderna capaz de se integrar mais nativamente à aplicação.

## Objetivo Geral

Conceder ao desenvolvedor de uma aplicação uma alternativa mais simplificada para gerenciamento de dados em arquivos dispensando o uso de consultas SQL e produção de código voltada ao gerenciamento bastando uma simples importação e chamada de função e inicialização dos parâmetros.

## Palavras-chave

- **Coleção**: Diretório que armazena um conjunto de arquivos de dados;
- **Chave**: Arquivo JSON que armazena um conjunto de registros em array;
- **Registro**: Array de dados no formato: `{ atributo: string, dado: any }` e localizador, definido em: `{ localizador: string, dados: Array<dados> }`;
- **Localizador**: Metadados de registro, composto pelos 6 primeiros caracteres do nome da coleção, a chave em que se encontra e a posição em que foi inserido na chave;
- **ColecMeta**: Arquivo JSON que armazena um Array com os dados sobre as coleções, como *nome, altura, largura* e *quadro de chaves*
- **Altura da coleção**: Limite de registros em um arquivo desconsiderando o cabeçalho da chave (metadados de chave);
- **Largura da coleção**: Limite de arquivos por coleção.

## Definição da Classe:

```TypeScript
class Hermes 
{
    protected colecNome: string;
    protected altura?: number | null;
    protected largura?: number | null;
    protected quadChaves: Array<number>;

    async init(): Promise<void>;
    async getColec(): Promise<void>;
    async rm(): Promise<void>;
    async inserir_dados(dados: any): Promise<string>;
    async rm_dados(localizador: string): Promise<void>;
    async dr_busca(localizador: string): Promise<any>;
    async it_busca(campo: Dados): Promise<any[]>;
    async it_rmDados(campo: Dados): Promise<void>;
}
```

### Funções dos métodos

Legenda:

- **Função do método** [`definição do método`]: descrição do método

    #### Exemplo:

    `implementação do método`

- **Inicializar Coleção** [`Hermes.init()`]: Cria o diretório da coleção e armazena os dados no arquivo `colecMeta.json`, após a inicialização torna-se possível a inserção de novos dados;

#### Exemplo:

```TypeScript
import { Hermes } from "@proj-hermes/hermes";

let pessoas: Hermes = new Hermes("Pessoas", 15, 5);

try {
    await pessoas.init();
} catch(err) {
    if(err instance of Error)
        console.error(err);
}
```

- **Capturar a coleção** [`Hermes.getColec()`]: Realiza busca no arquivo `colecMeta.json` e atribui os metadados de uma coleção existente referenciada pelo usuário ao objeto (na prática um auto-instanciamento de objeto), se faz necessário quando o objeto não se encontra instanciado, este método é o reverso do método `init()` o qual cria a coleção a partir dos dados obtidos na inicialização, como neste contexto a coleção já estará inicializada, basta capturá-la, necessária a chamda antes dos métodos de inserção e busca iterativa;

```TypeScript 
import { Hermes } from "@proj-hermes/hermes";

let pessoas: Hermes = new Hermes("Pessoas");

try {
    await pessoas.getColec(); //a coleção Pessoas passará a ter os metadados da coleção
} catch(err) {
    if(err instance of Error)
        console.error(err);
}
```

- **Remover a coleção** [`Hermes.rm()`]: Apaga o diretório da coleção e atualiza o arquivo `colecMeta.json` removendo os dados, após a remoção torna-se possível a inicialização de uma coleção com o mesmo nome da anterior;

#### Exemplo:

```TypeScript 
import { Hermes } from "@proj-hermes/hermes";

let pessoas: Hermes = new Hermes("Pessoas");

try {
    await pessoas.rm();
} catch(err) {
    if(err instance of Error)
        console.error(err);
}
```

- **Inserção de dados** [`Hermes.inserir_dados(dados: any)`]: Insere à útima posição da última chave disponível os dados informados pelo usuário, caso a última chave esteja cheia (isto é, a quantidade de registros é igual a altura da coleção) o programa cria um novo arquivo, insere os dados e retorna o localizador do registro. Caso não esteja no mesmo fluxo de execução que a inicialização do projeto se faz necessária a referência do método `getColec()`;

#### Exemplo 1: (fluxo de execução da inicialização)

```TypeScript 
import { Hermes } from "@proj-hermes/hermes";

let pessoas: Hermes = new Hermes("Pessoas", 15, 5);

try {
    await pessoas.init();
    let localizador: string = await pessoas.inserir_dados({ nome: "Gaspar", idade: 255, curso: "Computação" });
} catch(err) {
    if(err instance of Error)
        console.error(err);
}
```

#### Exemplo 2: (fluxo de execução posterior à inicialização)

```TypeScript 
import { Hermes } from "@proj-hermes/hermes";

let pessoas: Hermes = new Hermes("Pessoas");

try {
    await pessoas.getColec();
    let localizador: string = await pessoas.inserir_dados({ nome: "Gaspar", idade: 255, curso: "Computação" });
} catch(err) {
    if(err instance of Error)
        console.error(err);
}
```

- **Remoção direta dos dados** [`Hermes.rm_dados(localizador: string)`]: Remove diretamente registro presente na coleção a partir dos metadados de registro (localizador), este método dispensa uso de iterações ou recurssões removendo diretamente o registro no localizador apontado, esta função está sob profunda análise por provocar certa entropia na estrutura da coleção já que pode causar lacunas e produzir novas chaves sem necessidade;

#### Exemplo:

```TypeScript 
import { Hermes } from "@proj-hermes/hermes";

let pessoas: Hermes = new Hermes("Pessoas");

try {
    await pessoas.rm_dados("Pessoa.0.1"); //No caso, o primeiro registro da chave 0 da coleção Pessoas (sempre os 6 primeiros caracteres do nome da coleção)
} catch(err) {
    if(err instance of Error)
        console.error(err);
}
```

- **Busca direta dos dados** [`Hermes.dr_busca(localizador: string)`]: Captura diretamente registro presente na coleção a partir dos metadados de registro (localizador), este método dispensa uso de iterações ou recurssões removendo diretamente o registro no localizador apontado e retorna um objeto JavaScript com o localizador e os dados presentes no registros;

#### Exemplo:

```TypeScript 
import { Hermes } from "@proj-hermes/hermes";

let pessoas: Hermes = new Hermes("Pessoas");

try {
    let dados = await pessoas.dr_busca("Pessoa.0.1");
} catch(err) {
    if(err instance of Error)
        console.error(err);
}
```

- **Busca iterativa dos dados** [`Hermes.it_busca(campo: Dados)`]: Captura os dados após uma busca completa (isto é, em cada registro) e retorna um array de objetos JS com os registros que possuiram os mesmos valores do parâmetro `campo` que está definido em: `{ atributo: string, valor: string | number | boolean }`. Para este método, se faz necessário o uso de `getColec` caso não esteja no mesmo fluxo de execução do método `init()`;

#### Exemplo:

```TypeScript 
import { Hermes } from "@proj-hermes/hermes";

let pessoas: Hermes = new Hermes("Pessoas");

try {
    await pessoas.getColec();
    let dados = await pessoas.it_busca({ atributo: nome, valor: "Gaspar" }); //retorno: [{ nome: "Gaspar", idade: 255, curso: "Computação" }]
} catch(err) {
    if(err instance of Error)
        console.error(err);
}
```

- **Remoção iterativa dos dados** [`Hermes.it_rmDados(campo: Dados)`]: Remove os dados após uma busca completa (isto é, em cada registro), aplica a busca iterativa para encontrar o registro e em seguida remove-o. Para este método, se faz necessário o uso de `getColec` caso não esteja no mesmo fluxo de execução do método `init()`;

#### Exemplo:

```TypeScript 
import { Hermes } from "@proj-hermes/hermes";

let pessoas: Hermes = new Hermes("Pessoas");

try {
    await pessoas.getColec();
    await pessoas.it_rmDados({ atributo: nome, valor: "Gaspar" });
} catch(err) {
    if(err instance of Error)
        console.error(err);
}
```