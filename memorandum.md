# Memorando de Projeto

**Autor:** Felipe Eugênio Trindade Gaspar
**Data**: jun/2026
**Assunto**: Projeto Hermes - Reformulação do Projeto IODJSON

## Propósito do Projeto

O Projeto Hermes (nome inicial) tem como objetivo reformular o projeto pessoal IODJSON (Interface de Organização de Dados em JSON), uma interface de gerenciamento de dados consistentes que dispensa o uso de bancos de dados como o SQLite, permitindo uma integração nativa com a aplicação. A nova versão construída em TypeScript e Deno, busca ampliar a segurança e a velocidade de execução da ferramenta.

## Justificativa de Escolha do Deno

Após testes, o Deno mostrou-se a ferramenta ideal para o propósito do projeto. Seu suporte nativo ao TypeScript maximiza a previsibilidade das operações realizadas pela interface.

## Desafios Técnicos Identificados

- **Remoção de Registros**: Remoções de dados podem criar lacunas nos vetores das chaves, como o algoritmo sempre vai inserir os dados na última chave, as chaves anteriores podem ter posições vagas após a remoção de um registro se houver uma chave posterior. Estuda-se a implementação de um método conhecido como `reset()` na classe coleção para reorganizar os dados e preencher as lacunas.

- **Backup da coleção**: 

## Planos Futuros
- Preparação para publicação no JSR.
- Publicação como pacote JSR (gerenciador de pacotes do ecossistema Deno, equivalente ao NPM do Node.js);
- Integração com outras aplicações JS ou TS baseadas em Deno.
- Desenvolvimento da lógica de reorganização (método `reset()`);
- Otimização da busca recursiva;

## AVISO

O Projeto Hermes não se propõe a substituir bancos de dados como PostgreSQL, MySQL ou MongoDB. Trata-se de uma interface de gerenciamento de dados em arquivos a nível de aplicação, se seu projeto demanda acesso concorrente e criptografia a recomendação é utilizar os SGBDs, mas se seu projeto demandar acesso rápido a uma informação não sensível como metadados em aplicações.