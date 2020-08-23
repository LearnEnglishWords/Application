function goBack() {
  cy.get('.page')
    .wait(1000)
    .get('.navbar-main')
    .get('.left')
    .get('a.back').last()
    .click({force: true})
}

describe('Search', () => {

  it('Test search input', () => {
    cy.visit('/')                       

    // first show
    cy.get('.navbar-inner')                       
      .children('.right')
      .children('.link')
      .first()
      .click({force: true})

    // check show
    cy.get('.navbar-inner')                       
      .children('.title')
      .children('input')
      .should('be.visible') 

    // hide
    cy.wait(1000)
      .get('.navbar-inner')                       
      .children('.right')
      .children('.link')
      .first()
      .click({force: true})

    // check hidden
    cy.get('.navbar-inner')                       
      .children('.title')
      .children('input')
      .should('be.hidden') 

    // second show throw title
    cy.wait(1000)
      .get('.navbar-inner')                       
      .children('.title')
      .children('.text')
      .click({force: true})

    // check show
    cy.get('.navbar-inner')                       
      .children('.title')
      .children('input')
      .should('be.visible') 
  })


  it('Test search', () => {
    cy.visit('/')                       

    // second show throw title
    cy.wait(1000)
      .get('.navbar-inner')                       
      .children('.title')
      .children('.text')
      .click({force: true})

    // check show search input and search
    cy.get('.navbar-inner')                       
      .children('.title')
      .children('input')
      .should('be.visible') 
      .type('testing{enter}')
      
    // check search result
    cy.get('.page-content')                       
      .children('.mode-read')
      .children('.word')
      .contains('testing')
      .parent()
      .children('.pronunciation')
      .contains('ˈtes.tɪŋ')

    cy.wait(1000)

    // check show search input and search again
    cy.get('.navbar-inner')                       
      .children('.title')
      .children('input')
      .should('be.visible') 
      .last()
      .type('hello{enter}')
      
    // check search result
    cy.get('.page-content')                       
      .children('.mode-read')
      .children('.word')
      .contains('hello')
      .parent()
      .children('.pronunciation')
      .contains('heˈləʊ')

    cy.wait(1000)

    // check search unknown word 
    cy.get('.navbar-inner')                       
      .children('.title')
      .children('input')
      .should('be.visible') 
      .last()
      .type('asdf{enter}')
      
    // check search result
    cy.get('.search-failed')                       
      .contains('Probíhá vyhledávání')
      .wait(1000)
      .get('.search-failed')                       
      .contains('Požadované slovíčko nebylo nalezeno')

    goBack()

    cy.get('.page')                       
      .contains('Zvolte kolekci slovíček:')
  })


  it('Test word detail after search', () => {
    cy.visit('/')                       

    // second show throw title
    cy.wait(1000)
      .get('.navbar-inner')                       
      .children('.title')
      .children('.text')
      .click({force: true})

    // check show search input and search
    cy.get('.navbar-inner')                       
      .children('.title')
      .children('input')
      .should('be.visible') 
      .type('test{enter}')
      
    // check search result
    cy.get('.page-content')                       
      .children('.mode-read')
      .children('.word')
      .contains('test')
      .parent()
      .children('.pronunciation')
      .contains('test')

    // check sense
    cy.get('.page-title')
      .contains('Významy slova:')
      .get('.list-categories')
      .contains('test')
      .get('.list-categories')
      .contains('zkouška')
      .get('.list-categories')
      .contains('zkoušet')

    // check bottom panel
    cy.get('.search-bar')
      .contains('Příklady')
      .get('.search-bar')
      .contains('Upravit')
      .get('.search-bar')
      .contains('Uložit')
  })
})
