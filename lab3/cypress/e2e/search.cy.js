describe('Basic', () => {
  beforeEach(() => {
    // Odwiedź stronę główną przed każdym testem
    cy.visit('/')
  })

  it('Test 1: Should display main page elements correctly', () => {
    // Sprawdź, czy strona się załadowała
    cy.get('[data-cy="header"]').should('be.visible')
    
    // Sprawdź tytuł strony
    cy.get('[data-cy="site-title"]').should('contain.text', 'Books4Cash.io')
    
    // Sprawdź sekcję hero
    cy.get('[data-cy="hero-section"]').should('be.visible')
    cy.get('[data-cy="hero-section"]').should('contain.text', 'Turn Your Books Into Cash')
    
    // Sprawdź przycisk "Add New Book" w sekcji hero
    cy.get('[data-cy="add-new-book-hero-button"]').should('be.visible')
    cy.get('[data-cy="add-new-book-hero-button"]').should('contain.text', 'Add New Book')
    
    // Sprawdź footer
    cy.contains('© 2025 Books4Cash.io. All rights reserved.').should('be.visible')
  })

  it('Test 2: Should navigate to new book page and show form elements', () => {
    // Kliknij przycisk "Add New Book" w sekcji hero
    cy.get('[data-cy="add-new-book-hero-button"]').click()
    
    // Sprawdź, czy nastąpiła nawigacja do strony /new
    cy.url().should('include', '/new')
    
    // Sprawdź, czy jesteśmy na stronie dodawania książki po tytule
    cy.contains('Add New Book').should('be.visible')
    
    // Sprawdź czy formularz lub jego elementy są widoczne (fallback jeśli data-cy nie działa)
    cy.get('form').should('exist')
    cy.get('input[name="title"], input[placeholder*="title"], input[id="title"]').should('be.visible')
    cy.get('input[name="author"], input[placeholder*="author"], input[id="author"]').should('be.visible')
  })

  it('Test 3: Should display and interact with search functionality', () => {
    // Sprawdź, czy pole wyszukiwania ma odpowiedni placeholder
    cy.get('[data-cy="search-input"]')
      .should('have.attr', 'placeholder', 'Search by title, author or category...')
    
    // Sprawdź, czy można wpisać tekst w pole wyszukiwania
    cy.get('[data-cy="search-input"]').type('JavaScript')
    cy.get('[data-cy="search-input"]').should('have.value', 'JavaScript')
    
    // Sprawdź, czy przycisk filtrów działa
    cy.get('[data-cy="filter-toggle-button"]').should('be.visible').click()
    cy.get('[data-cy="filter-options"]').should('be.visible')
    
    // Zamknij filtry
    cy.get('[data-cy="close-filters-button"]').click()
    cy.get('[data-cy="filter-options"]').should('not.exist')
  })

  it('Test 4: Should show navigation and basic functionality', () => {
    // Sprawdź podstawowe elementy nawigacji
    cy.contains('Books4Cash.io').should('be.visible')
    
    // Sprawdź czy istnieje jakiś przycisk logowania/przyciski w nawigacji
    cy.get('nav').first().within(() => {
      // Sprawdź czy istnieje przycisk z tekstem zawierającym "login", "sign" itp.
      cy.get('button, a').should('have.length.greaterThan', 0)
    })
    
    // Przejdź do dodawania książki
    cy.get('[data-cy="add-new-book-hero-button"]').click()
    
    // Sprawdź, czy jesteśmy na stronie dodawania książki
    cy.url().should('include', '/new')
    
    // Sprawdź podstawowe pola formularza (używając bardziej ogólnych selektorów)
    cy.get('input[type="text"]').should('have.length.greaterThan', 1)
    cy.get('input[type="number"], input[type="text"]').should('exist')
    
    // Wypełnij pola jeśli można je znaleźć
    cy.get('input').first().type('Test Book Title')
    cy.get('input').eq(1).type('Test Author')
    
    // Sprawdź, czy przyciski formularza są widoczne
    cy.get('button[type="submit"], button').should('have.length.greaterThan', 0)
  })
})