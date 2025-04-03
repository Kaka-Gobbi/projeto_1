/// <reference types="cypress" /> 

import { format } from '../support//utils'

//const { it } = require("mocha");
//const { constant } = require("cypress/types/lodash");
//const { it } = require("mocha");
/// const { it } = require("mocha");


context('Dev Finances Agilizei', () => {
    // hooks
    // trechos que executam antes e depois dos testes 
    // before -> antes de todos os testes
    // beforeEach -> antes de cada teste 
    // after -> depois de todos os testes 
    // afterEach -> depois de cada teste 

    beforeEach(() => {
        cy.visit('https://devfinance-agilizei.netlify.app')
        cy.get('#data-table tbody tr').should('have.length', 0)
    });

    it('Cadastrar entradas', () => {

        cy.get('#transaction .button').click() // id + classe
        cy.get('#description').type('Mesada') // id
        cy.get('[name=amount]').type(12) // atributos 
        cy.get('[type=date]').type('2021-03-21') //atributos 
        cy.get('button').contains("Salvar").click() // tipo e valor

        cy.get('#data-table tbody tr').should('have.length', 1)
        
    });


    it('Cadastrar saídas', () => {
      
        cy.get('#transaction .button').click() // id + classe
        cy.get('#description').type('Mesada') // id
        cy.get('[name=amount]').type(-12) // atributos 
        cy.get('[type=date]').type('2021-03-21') //atributos 
        cy.get('button').contains("Salvar").click() // tipo e valor

        cy.get('#data-table tbody tr').should('have.length', 1)   

    });

    it('Remover entradas e saídas', () => {
        const entrada = 'Mesada'
        const saída = 'KinderOvo'

        cy.get('#transaction .button').click() // id + classe
        cy.get('#description').type(entrada) // id
        cy.get('[name=amount]').type(100) // atributos 
        cy.get('[type=date]').type('2021-03-21') //atributos 
        cy.get('button').contains("Salvar").click() // tipo e valor

        cy.get('#transaction .button').click() // id + classe
        cy.get('#description').type(saída) // id
        cy.get('[name=amount]').type(-35) // atributos 
        cy.get('[type=date]').type('2021-03-21') //atributos 
        cy.get('button').contains("Salvar").click() // tipo e valor

        // estratégia 1: voltar para elemento pai, e avançar para um td img attr
        
        cy.get('td.description')
          .contains(entrada)
          .parent()
          .find('img[onclick*=remove]')
          .click()

        // estratégia 2: buscar todos os irmãos, e buscar o que tem img + attr 

        cy.get('td.description')
          .contains(saída)
          .siblings()
          .children('img[onclick*=remove]')
          .click()

        cy.get('#data-table tbody tr').should('have.length', 0)   

    });

    it.only('Validar saldo com diversar transações', () => {
        const entrada = 'Mesada'
        const saída = 'KinderOvo'

        cy.get('#transaction .button').click() // id + classe
        cy.get('#description').type(entrada) // id
        cy.get('[name=amount]').type(100) // atributos 
        cy.get('[type=date]').type('2021-03-21') //atributos 
        cy.get('button').contains("Salvar").click() // tipo e valor

        cy.get('#transaction .button').click() // id + classe
        cy.get('#description').type(saída) // id
        cy.get('[name=amount]').type(-35) // atributos 
        cy.get('[type=date]').type('2021-03-21') //atributos 
        cy.get('button').contains("Salvar").click() // tipo e valor

        // capturar as linhas com as transações e as colunas com valores
        // capturar o texto das colunas
        // formatar esses valores das linhas 

        // somar os valores de entradas e saidas

        // capturar o texto do total 
        // comparar o somatorio de entradas e despesas com o total

        let incomes = 0
        let expenses = 0 

        
        cy.get('#data-table tbody tr')
          .each(($el, index, $list) => { 
        
              cy.get($el).find('td.income, td.expense').invoke('text').then(text => {
                if(text.includes('-')){
                  expenses = expenses + format(text)
                } else {
                  incomes = incomes + format(text)
                }
                 
                cy.log(`entradas`, incomes)
                cy.log (`saidas`, expenses)

                })
                  
          })
          
      cy.get('#totalDisplay').invoke('text').then(text => {
        
        let formattedTotalDisplay = format(text)
        let expectedTotal = incomes + expenses 

        expect(formattedTotalDisplay).to.eq(expectedTotal)
        
      })


    });
});

    // - entender o fluxo manualmente 
    // - mapear os elementos que vamos interagir 
    // - descrever as interações com o cypress
    // - adicionar as asserções que a gente precisa