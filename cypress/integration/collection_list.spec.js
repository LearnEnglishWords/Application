function goBack() {
  cy.get('.page')
    .wait(1000)
    .get('.navbar-main')
    .get('.left')
    .get('a.back').last()
    .click({force: true})
}

function checkDownload(collectionName, waitTime) {
  cy.get('.collection-list')
    .contains(collectionName)
    .parent()
    .contains('Stahování')
    .should('be.visible') 

  cy.get('.collection-list')
    .contains(collectionName)
    .parent()
    .contains('Ukládání', { timeout: 20000 })
    .should('be.visible') 

  return cy.get('.collection-list')
    .contains(collectionName)
    .parent()
    .wait(waitTime)
    .contains('Pokračovat')
    .should('be.visible') 
}

function checkCollection(collectionName, collectionText, activeButton) {
  return cy.get('.collection-list')
    .contains(collectionName)
    .click()                 
    .parent()
    .contains(collectionText)
    .parentsUntil('.accordion-item-content')
    .contains(activeButton)
    .should('be.visible') 
}


describe('CollectionList', () => {

  it('Open Personal collection', () => {
    indexedDB.deleteDatabase('lew')
    cy.visit('/')                       

    checkCollection('Personal', 'Přidávejte vlastní slovíčka a vytvářejte si tak své vlastní kategorie slovíček.', 'Pokračovat')
      .click()

    cy.get('.page-container')
      .contains('Můj seznam slovíček')
      .should('be.visible') 

    goBack()
  })

  it('Intermediate collection cannot download before Basic', () => {
    indexedDB.deleteDatabase('lew')
    cy.visit('/')                       

    checkCollection('Intermediate','Se znalostí 2500 az 3000 anglických slov dokážete porozumět až 80% veškeré anglické konverzace.', 'Stáhnout')
      .click()
      .get('.dialog')
      .should('be.visible') 
      .contains('Tato kolekce vyžaduje mít nejdříve staženu: Basic kolekci slovíček.')
      .parent()
      .get('.dialog-buttons')
      .contains('Ok')
      .click()
  })

  it('Download Basic collection', () => {
    indexedDB.deleteDatabase('lew')
    cy.visit('/')                       

    checkCollection('Basic','Obsahuje všechna základní anglická slovíčka pro základní komunikaci a dorozumění.', 'Stáhnout')
      .click()

    checkDownload("Basic", 40000)
      .click()

    cy.get('.page')
      .contains('Vybrat slovíčka pro učení')
      .should('be.visible') 

    goBack()
  })

  it('Download Intermediate collection after Basic collection', () => {
    cy.visit('/')                       

    checkCollection('Intermediate','Se znalostí 2500 az 3000 anglických slov dokážete porozumět až 80% veškeré anglické konverzace.', 'Stáhnout')
      .click()

    checkDownload("Intermediate", 100000)
      .click()

    cy.get('.page')
      .contains('Vybrat slovíčka pro učení')
      .should('be.visible') 

    goBack()
  })

  it('Download Category collection', () => {
    cy.visit('/')                       

    checkCollection('Category','Zde jsou slova rozřazená podle témat do různých kategorií.', 'Stáhnout')
      .click()

    checkDownload("Category", 50000)
      .click()

    cy.get('.page').contains('Vyberte si kategorie')
    cy.get('.page').contains('Zvířata')
    cy.get('.page').contains('Tělo')
    cy.get('.page').contains('Oblečení')
    cy.get('.page').contains('Auto')

    goBack()
  })
})
