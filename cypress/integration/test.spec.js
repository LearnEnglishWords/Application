describe('First start', () => {
  beforeEach(() => {
    indexedDB.deleteDatabase('lew')
  });

  it('Intermediate cannot download before Basic', () => {
    cy.visit('/')                       // command
      .get('.collection-list')
      .contains('Intermediate')
      .click()                 // command
      .parent()
      .contains('Se znalostí 2500 az 3000 anglických slov dokážete porozumět až 80% veškeré anglické konverzace.')
      .parent()
      .contains('Stáhnout')
      .should('be.visible') 
      .click()
      .get('.dialog')
      .should('be.visible') 
      .contains('Tato kolekce vyžaduje mít nejdříve staženu: Basic kolekci slovíček.')
      .parent()
      .get('.dialog-buttons')
      .contains('Ok')
      .click()
  })

  it('Download Basic', () => {
    cy.visit('/')                       
      .get('.collection-list')
      .contains('Basic')
      .click()                 
      .parent()
      .contains('Obsahuje všechna základní anglická slovíčka pro základní komunikaci a dorozumění.')
      .parentsUntil('.accordion-item-content')
      .contains('Stáhnout')
      .should('be.visible') 
      .click()

    cy.get('.collection-list')
      .contains('Basic')
      .parent()
      .contains('Stahování')
      .should('be.visible') 

    cy.get('.collection-list')
      .contains('Basic')
      .parent()
      .contains('Ukládání')
      .should('be.visible') 

    cy.get('.collection-list')
      .contains('Basic')
      .parent()
      .wait(30000)
      .contains('Pokračovat')
      .should('be.visible') 
  })
})
