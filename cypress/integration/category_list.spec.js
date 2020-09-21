function goBack() {
  cy.get('.page')
    .wait(1000)
    .get('.navbar-main')
    .get('.left')
    .get('a.back').last()
    .click({force: true})
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

function checkStatistics(knownNum, learningNum, unknownNum) {
  cy.get('.header-known')
    .contains(knownNum)
    .should('be.visible') 

  cy.get('.header-learning')
    .contains(learningNum)
    .should('be.visible') 

  cy.get('.header-unknown')
    .contains(unknownNum)
    .should('be.visible') 
}

function continueButtonClick() {
  cy.get('.footer-content')
    .contains('Pokračovat')
    .should('be.visible') 
    .click()
}

describe('CategoryList', () => {

  it('Test CategoryList', () => {
    cy.visit('/')                       

    cy.get('.collection-list')
      .contains('Category')
      .parent()
      .contains('Zde jsou slova rozřazená podle témat do různých kategorií.')
      .parentsUntil('.accordion-item-content')
      .contains('Pokračovat')
      .should('be.visible') 
      .click()

    continueButtonClick()
    checkStatistics(0, 0, 1311)

    goBack()

    cy.get('.page').contains('Tělo').click()
    cy.get('.page').contains('Barvy').click()
    cy.get('.page').contains('Auto').click()

    continueButtonClick()
    checkStatistics(0, 0, 123)

    goBack()

    cy.get('.page').contains('Auto').click()

    continueButtonClick()
    checkStatistics(0, 0, 69)

    goBack()
    goBack()
  })
})
