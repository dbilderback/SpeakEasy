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
     
    //Check Signin Functionality   - Unauthorized User 
    describe('Signin Page', function () {
        describe('given invalid credentials', () => {
            it('should state user is not authorized', done => {
            nightmare
            .goto('http://speakeasyappgt.herokuapp.com/signin')
            .type('input[name="email"]', 'not a valid email')
            .type('input[name="password"]', 'invalid password')
            .click('input[type="submit"]')
            .wait(5000)
            .end()
            .then(function(result){ done() })
            .catch(done)
            })
        })
    })

    //Check Create New User  - Null 
    describe('Create Account', function () {
        describe('given Null Data', () => {
            it('should fail stating bad request', done => {
            nightmare
            .goto('http://speakeasyappgt.herokuapp.com/signup')
            .type('input[name="firstname"]', '')
            .click('input[type="submit"]')
            .wait(2000)
            .end()
            .then(function(result){ done() })
            .catch(done)
            })
        })
    })

    //Check Create New User  - Partial Data 
    describe('Create Account', function () {
        describe('Given Incomplete Data', () => {
            it('should fail stating bad request', done => {
            nightmare
            .goto('http://speakeasyappgt.herokuapp.com/signup')
            .type('input[name="firstname"]', '')
            .type('input[name="lastname"]', '')
            .type('input[name="email"]', 'bizbuz2014@gmail.com')
            .type('input[name="password"]', 'crazybee')
            .click('input[type="submit"]')
            .wait(5000)
            .end()
            .then(function(result){ done() })
            .catch(done)
            })
        })
    })

     //Check Create New User  - Successfully
     describe('Create Account', function () {
        describe('Given all field inputs correctly', () => {
            it('should create account', done => {
            nightmare
            .goto('http://speakeasyappgt.herokuapp.com/signup')
            .type('input[name="firstname"]', 'Baby')
            .type('input[name="lastname"]', 'Hack')
            .type('input[name="email"]', 'bizbuz2014@gmail.com')
            .type('input[name="password"]', 'crazybee')
            .click('input[type="submit"]')
            .wait(5000)
            .end()
            .then(function(result){ done() })
            .catch(done)
            })
        })
    })

    //Check Signin Functionality   - Success 
    describe('Signin Page', function () {
        describe('given valid credentials', () => {
            it('should navigate to users diary', done => {
            nightmare
            .goto('http://speakeasyappgt.herokuapp.com/signin')
            .type('input[name="email"]', 'bizbuz2014@gmail.com')
            .type('input[name="password"]', 'crazybee')
            .click('input[type="submit"]')
            .wait(5000)
            .end()
            .then(function(result){ done() })
            .catch(done)
            })
        })
    })

    
})