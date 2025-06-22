<h2 align="center">
    Golden Raspberry Awards Frontend
</h2>


## Descrição

Aplicação frontend desenvolvida em [Angular](https://github.com/angular/angular-cli) para visualização das estatísticas dos filmes indicados e vencedores do prêmio Golden Raspberry Awards.


## Funcionalidades
- Visualização dos produtores com maior e menor intervalo entre vitórias.
- Listagem dos anos com múltiplos vencedores.
- Listagem dos três estúdios com mais vitórias.
- Pesquisa de filmes vencedores por ano.
- Paginação de resultados na listagem de filmes.


## Tecnologias Utilizadas

- [Angular](https://github.com/angular/angular-cli) - Framework principal
- [TypeScript](https://www.typescriptlang.org/) - Linguagem
- Karma & Jasmine - Testes unitários


## Setup do Projeto

- Node.js v20+
- Angular CLI v19+
- npm

```bash
$ git clone https://github.com/vanessafiori/golden-raspberry-awards-web.git
$ cd golden-raspberry-awards-web
$ npm install
```


## Executando a aplicação

```bash
# Desenvolvimento
$ ng serve
```
Acesse em: http://localhost:4200

## Building

```bash
ng build
```

## Executando os Testes

```bash
# Testes unitários
$ ng test
```

## Estrutura de Telas

- /dashboard - Visão geral com estatísticas dos vencedores.
- /movies - Listagem paginada dos filmes.


## Integração com API

Esta aplicação consome os seguintes endpoints:

- GET /movies?page=9&size=99&winner=true&year=2018 
- GET /movies?projection=years-with-multiple-winners
- GET /movies?projection=studios-with-win-count
- GET /movies?projection=max-min-win-interval-for-producers
- GET /movies?winner=true&year=2018


## Contato

Vanessa Fiori
- Portfólio - https://vanessa-fiori.web.app/
- Linkedin - https://www.linkedin.com/in/vanessa-fiori-a6399a211/