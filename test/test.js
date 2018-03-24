const Nightmare = require('nightmare'); 
const assert = require('assert'); 


describe('UI Flow Tests', function() {
    this.timeout('200000')
  
    let nightmare = null
    beforeEach(() => {
      nightmare = new Nightmare({ show: true })
    })

    //Check that the home page loads without errors 
    describe('/Home Page', () => {
        it('should load without error', done => {
          // your actual testing urls will likely be `http://localhost:port/path`
          nightmare.goto('http://speakeasyappgt.herokuapp.com/signin')
            .end()
            .then(function (result) { done() })
            .catch(done)
        })
      })
     
    //Check Signin Functionality   - Unaouthorized User 
    describe('Signin Page', function () {
        describe('given bad data, it should state user is not authorized', () => {
            it('should fail', done => {
            nightmare
            .goto('http://speakeasyappgt.herokuapp.com/signin')
            .type('input[name="email"]', 'not a valid email')
            .type('input[name="password"]', 'invalid password')
            .click('input[type="submit"]')
            .wait(2000)
            .end()
            .then()
            .catch(done)
            })
        })
    })

    

    //Check Create Account Functionality  
    describe('Sign In Page to Create Account Navigation', function () {
        describe('On clicking the Create Button, it should go to Create Aaccount Page', () => {
            it('should fail', done => {
            nightmare
            .goto('http://speakeasyappgt.herokuapp.com/signin')
            .click('.btn"]')
            .wait(2000)
            .end()
            .then()
            .catch(done)
            })
        })
    })

    

})