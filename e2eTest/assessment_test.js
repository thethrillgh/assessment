describe('Accessment tests',function(){
    var baseURL = "http://localhost:8081/";
    var server = require("../e2e_test.js");
    
    xdescribe("on start of test",function(){
        beforeEach(function(){
            browser.get(baseURL);
            //console.log("hi")
        });
        
        it("will have a button for login",function(){
           var loginB = element(by.id("loginButton"));
            expect(loginB).toBeDefined();
            expect(loginB.getText())
                .toEqual("Login");
            //console.log("hi")
        });
        
        it("will have a dropdown menu for department",function(){
           var  dropD = element(by.id("linButton"));
            expect(dropD).toBeDefined();
        });
    });
});