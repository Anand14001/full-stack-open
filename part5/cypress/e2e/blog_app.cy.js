describe('Blog app', function(){
    beforeEach(function(){
        cy.request('POST','http://localhost:3001/api/testing/reset')
        const user = {
            name:'james w',
            username:'rook',
            password:'sekret'
        }
        
        cy.request('POST', 'http://localhost:3001/api/users/', user)
        cy.visit('')
    })

    it('Login form is shown', function(){
        cy.contains('Login to application')
        cy.contains('label','username')
        cy.contains('label','password')
        cy.contains('button','login')
    })

    describe('Login',function(){
        it('succeeds with correct credentials',function(){
            cy.contains('label','username').type('rook')
            cy.contains('label','password').type('sekret')
            cy.get('#login-btn').click()
            cy.contains('james w logged in')
        })

        it('fails with wrong credentials',function(){
            cy.contains('label','username').type('wrong username')
            cy.contains('label','password').type('wrong')
            cy.get('#login-btn').click()
            cy.contains('james w logged in').should('not.exist')
                        cy.get('#notification_container')
                .should('be.visible')
                .and('have.css', 'border-color', 'rgb(244, 67, 54)') // #f44336 in RGB
                .and('have.css', 'background-color', 'rgb(204, 204, 204)') // #ccc in RGB
            
            cy.get('#notification_txt')
                .should('contain', 'Error while logging in!')
                .and('have.css', 'color','rgb(244, 67, 54)')
        })
    })

    describe('when loggedd in', function(){

        const firstBlog = {
        title: 'First Blog',
        author: 'Author One',
        url: 'http://firstblogexample.com',
        likes: 5
        }

        const secondBlog = {
        title: 'Second Blog',
        author: 'Author Two',
        url: 'http://secondblogexample.com',
        likes: 8
        }

        const thirdBlog = {
        title: 'Third Blog',
        author: 'Author Three',
        url: 'http://thirdblogexample.com',
        likes: 12
        }

        beforeEach(function(){
            cy.login({username:'rook', password:'sekret'})
        })

          it('A blog can be created', function() {
            cy.get('.blog').should('have.length', 0)
            
            cy.contains('button','Create new blog').click()
            cy.get('form').should('be.visible')

            cy.contains('label','title').type('test blog')
            cy.contains('label','author').type('test author')
            cy.contains('label','url').type('www.test.com')
            cy.get('#create_blog_btn').click()


            cy.contains('test blog')
            cy.contains('test author')
            
        })

        it('A blog can be liked', function(){
            cy.createBlog(firstBlog)
            cy.get('#blog_view_btn').click()
            cy.get('#like_btn').click()
            cy.contains('likes: 6')

        })

        it('A blog can be deleted by the creator of the blog', function(){
            cy.createBlog(secondBlog)
            cy.get('#blog_view_btn').click()
            cy.contains('Second Blog Author Two')
            cy.get('#remove-button').should('exist')
            cy.get('#remove-button').click()
            cy.contains('Second Blog Author Two').should('not.exist')
        })

        it('Only creator of the blog can see the remove button of the blog',function(){
            cy.createBlog(firstBlog)
            cy.contains('First Blog Author One')
            cy.get('#blog_view_btn').click()
            cy.get('#remove-button').should('exist')

            const newUser = {
             name:'New User',
             username:'newuser',
             password:'sekret'
            }

            cy.request('POST','http://localhost:3001/api/users/', newUser)
            cy.login({username:'newuser', password:'sekret'})

            cy.contains('First Blog Author One').should('exist')
            cy.get('#blog_view_btn').click()
            cy.get('#remove-button').should('not.exist')
        })
it('Blogs are ordered by likes with most liked first using existing blogs', function(){
    cy.createBlog(firstBlog) 
    cy.createBlog(secondBlog) 
    cy.createBlog(thirdBlog) 
    
    cy.reload()

    
    cy.get('.blog').should('have.length', 3)
    
    cy.get('.blog').eq(0).should('contain', 'Third Blog')
    cy.get('.blog').eq(0).should('contain', 'likes: 12')
    
    cy.get('.blog').eq(1).should('contain', 'Second Blog')
    cy.get('.blog').eq(1).should('contain', 'likes: 8')
    
    cy.get('.blog').eq(2).should('contain', 'First Blog')
    cy.get('.blog').eq(2).should('contain', 'likes: 5')
})
    })
})