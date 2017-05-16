describe('Accessment tests',function()
{
    var baseURL = "http://localhost:8081/";
    var server = require("../e2e_test.js");
    
    describe("on start of test",function(){
        beforeEach(function(){
            browser.get(baseURL);
        });
        
        it("will have a button for login",function(){
           var loginB = element(by.id("loginButton"));
            expect(loginB).toBeDefined();
        });
    });
})