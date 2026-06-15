# proj_hermes
Projeto Hermes

## Apresentação

O Projeto Hermes (antigo IODJSON) é uma interface de manipulação de dados persistentes em nível de aplicação, o projeto se propõe a ser uma alternativa ao SQLite como uma solução moderna capaz de se integrar mais nativamente à aplicação.

## Objetivo Geral

Conceder ao desenvolvedor de uma aplicação uma alternativa mais simplificada para gerenciamento de dados em arquivos dispensando o uso de consultas SQL e produção de código voltada ao gerenciamento bastando uma simples importação e chamada de função e inicialização dos parâmetros.

## Palavras-chave

- **Coleção**: Diretório que armazena um conjunto de arquivos de dados;
- **Chave**: Arquivo JSON que armazena um conjunto de registros em array;
- **Registro**: Array de dados no formato: `{ atributo: "atributo", dado: "valor" }` e localizador;
- **Localizador**: Metadados de registro, composto pelos 6 primeiros caracteres do nome da coleção, a chave em que se encontra e a posição em que foi inserido na chave;
- **ColecMeta**: Arquivo JSON que armazena um Array com os dados sobre as coleções, como *nome, altura, largura* e *quadro de chaves*
- **Altura da coleção**: Limite de registros em um arquivo desconsiderando o cabeçalho da chave (metadados de chave);
- **Largura da coleção**: Limite de arquivos por coleção.

## Função Principal

Em vez de precisar instanciar uma classe e utilzizar vários métodos, o Hermes realiza a exportação de uma função e através do enum *Modos* que é exportado juntamente com a função o usuário consegue orientar a execução do programa.

### Definição da Função
`const Hermes = async (modo: Modos, params: h_params): Promise<any>`

- **Inicalizar Coleção** [`Modos.iniciar_colec`]: Cria o diretório da coleção e o primeiro arquivo de dados, para este modo é necessário inicializar o objeto `params` com as chaves `colecNome`, `altura` e `largura`, neste modo, a função retornará `true` se a operação for bem sucedida ou `false` se houver erro;

#### Exemplo
```
import { Modos, Hermes } from "./proj_hermes/index.ts";

Hermes(Modos.iniciar_colec, { colecNome: "ColecTeste", altura: 50, largura: 20 });
```

- **Remover Coleção** [`Modos.remover_colec`]: Remove o diretório da coleção e atualiza o arquivo `colecMeta.json` ao remover a coleção todos os dados são também removido, uma função `backup()` está sendo estudada para permitir a remoção da coleção sem provocar perdas nos dados. Para esta função se faz necessário somente a inicialização de `params.colecNome`, a função retornará `true` se a operação for bem sucedida ou `false` se houver erro;

#### Exemplo
```
import { Modos, Hermes } from "./proj_hermes/index.ts";

Hermes(Modos.remover_colec, { colecNome: "ColecTeste" });
```

- **Inserir Dados** [`Modos.salvar_dados`]: Insere à útima posição da última chave disponível os dados informados pelo usuário, caso a última chave esteja cheia (isto é, a quantidade de registros é igual a altura da coleção) o programa cria um novo arquivo, insere os dados e retorna o localizador do registro.Para esta função se faz necessário a inicialização de `params.colecNome` e `params.dados`, a função retornará `true` se a operação for bem sucedida ou `false` se houver erro;

#### Exemplo
```
import { Modos, Hermes } from "./proj_hermes/index.ts";

Hermes(Modos.salvar_dados, { 
        colecNome: "ColecTeste", 
        dados: { nome: "Gaspar", idade: 25, maior: true }
    }
);
```

- **Remover Dados** [`Modos.remover_dados`]: Remove os dados no localizador especificado, por este modo causar certa entropia na estrutura da coleção, estuda-se a implementação da função `reset()` para reorganizar os dados ao longo das chaves. Para esta função se faz necessário a inicialização de `params.colecNome` e `params.localizador`, a função retornará `true` se a operação for bem sucedida ou `false` se houver erro;

#### Exemplo
```
import { Modos, Hermes } from "./proj_hermes/index.ts";

Hermes(Modos.remover_dados, { colecNome: "ColecTeste", localizador: "ColecT.0.1"});
```

- **Buscar Direta de Dados** [`Modos.buscar_dados`]: recupera os dados no localizador especificado, de forma direta, sem uso de recurções ou iterações para acessar os dados, a partir dos metadados de registro que compõe o localizador é possível encontrar a posição exata dos dados. Para esta função se faz necessário a inicialização de `params.colecNome` e `params.localizador`, a função retornará o registro se a operação for bem sucedida ou `false` se houver erro;

#### Exemplo
```
import { Modos, Hermes } from "./proj_hermes/index.ts";

Hermes(Modos.buscar_dados, { colecNome: "ColecTeste", localizador: "ColecT.0.1"});
```

- **Buscar Iterativa de Dados** [`Modos.buscar_dados_it`]: recupera os dados de acordo com um atributo e valor especificado, a partir do método iterativo o programa verifica as chaves em busca de registros que contenham o atributo e valor especificado. Para esta função se faz necessário a inicialização de `params.colecNome`, `params.dados_busca`, a função retornará um array com todos os registros que possuirem o atributo e valor desejado se a operação for bem sucedida ou `false` se houver erro;

#### Exemplo
```
import { Modos, Hermes } from "./proj_hermes/index.ts";

Hermes(Modos.buscar_dados, { 
        colecNome: "ColecTeste", 
        dadosBusca: { atributo: "idade", valor: 25 }
    }
);
```

## AVISO

O Projeto Hermes não se propõe a substituir bancos de dados como PostgreSQL, MySQL ou MongoDB. Trata-se de uma interface de gerenciamento de dados em arquivos a nível de aplicação, se seu projeto demanda acesso concorrente e criptografia a recomendação é utilizar os SGBDs, mas se seu projeto demandar acesso rápido a uma informação não sensível como metadados em aplicações.
