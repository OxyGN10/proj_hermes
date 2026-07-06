# Memorando de Projeto

**Autor:** Felipe Eugênio Trindade Gaspar<br>
**Data**: jun/2026<br>
**Assunto**: Projeto Hermes - Reformulação do Projeto IODJSON<br>

## Propósito do Projeto

O Projeto Hermes (nome inicial) tem como objetivo reformular o projeto pessoal IODJSON (Interface de Organização de Dados em JSON), uma interface de gerenciamento de dados consistentes que dispensa o uso de bancos de dados como o SQLite, permitindo uma integração nativa com a aplicação. A nova versão construída em TypeScript e Deno, busca ampliar a segurança e a velocidade de execução da ferramenta.

## Justificativa de Escolha do Bun

A reavaliação do projeto que me levou a produzir a versão 2.0, também me levou a mudar o ambiente de execução padrão, testes realizados com o Bun me levaram a considerá-lo como ambiente preferencial para execução desta solução, no entanto, trabalho para que esta solução também seja funcional para usuários do Deno, o Bun rapidamente assumiu a posição de ambiente de execução preferencial devido a correção de pontos negativos presentes até mesmo no Deno, como a simplificação da produção de projetos React e melhorias de performance.

## Mudanças da versão 2.0

- **Utilização da orientação a objetos**: o abandono da arquitetura funcional se deu de um modo que permitiria ao usuário uma maior flexibilidade para manipular os dados, os quais permitira a partir da herança implementar uma arquitetura de manipulação que se adequasse à realidade de cada projeto;
- **Modificação do runtime original deno -> bun**: embora a arquitetura tenha sido modificada, segue a compatibilidade com o ecossistema 'Deno', no entanto, o projeto foi reformulado para o Bun (embora ainda reserve compatibilidade com o Deno).

## Desafios Técnicos Identificados

- **Remoção de Registros**: Remoções de dados podem criar lacunas nos vetores das chaves, como o algoritmo sempre vai inserir os dados na última chave, as chaves anteriores podem ter posições vagas após a remoção de um registro se houver uma chave posterior. Estuda-se a implementação de um método conhecido como `reset()` na classe coleção para reorganizar os dados e preencher as lacunas;

- **Backup da coleção**: Remoções de coleções também removem os arquivos de dados e seus conteúdos por esta razão estuda-se também implementar uma função para copiar os dados presentes nas chaves, um método como `backup()` permitirá ao usuário salvar os dados caso seja necessário copiar os dados prevenindo-os da exclusão da coleção.

## Planos Futuros
- ~~Preparação para publicação no JSR.~~
- ~~Publicação como pacote JSR (gerenciador de pacotes do ecossistema Deno, equivalente ao NPM do Node.js);~~
- Integração com outras aplicações JS ou TS baseadas em Deno.
- ~~Desenvolvimento da lógica de reorganização (método `reset()`);~~
- ~~Otimização da busca recursiva;~~

## Desafios Vencidos
- Transformação da busca recursiva em busca iterativa, otimizando-a;
- Publicação como pacote JSR (o pacote encontra-se em adaptação);
- Uma implementação foi realizada, e em vez de utilizar o método `chave.splice()` ao remover os dados, a posição é definida como `null` o que permite a reescrita dos dados. A lógica de inserção dos dados também foi modificada para buscar também esses registros.

## História 

Desenvolvendo um projeto em React Native, precisava criar uma seção na aplicação voltada exclusivamente para o gerenciamento de dados contidos em arquivos JSON, ocorre que utilizar a cláusula `node:require()` acessa o arquivo JSON como somente leitura impossibilitando a reescrita do arquivo, então decidi fazer estudos com o `node:fs` para manipular o arquivo JSON, o programa ganhou uma complexidade tanta que se tornou um programa à parte, funcionando com uma lógica completamente distinta do programa principal, após realizar alguns testes com o `fs` surge a primeira versão do IODJSON, no entanto um problema havia: *como buscar por um dado que eu não conheço sua posição exata?*, a resposta veio como uma luz em minha mente: *"busca recursiva"*, outro problema silencioso, se encontrava no próprio JavaScript, já a partir da versão 4.1 do IODJSON (última versão do projeto hermes com o antigo nome), a ideia era recriar o projeto otimizando-o em TypeScript, mas havia um problema com isso, o fato do Node.js não oferecer suporte nativo ao TS, para contornar tal limitação, ao migrar pro TS, optei então pela tecnologia Deno e tem dado os resultados desejados para a proposta do projeto.

## AVISO

O Projeto Hermes não se propõe a substituir bancos de dados como PostgreSQL, MySQL ou MongoDB. Trata-se de uma interface de gerenciamento de dados em arquivos a nível de aplicação, se seu projeto demanda acesso concorrente e criptografia a recomendação é utilizar os SGBDs, mas se seu projeto demandar acesso rápido a uma informação não sensível como metadados em aplicações.
