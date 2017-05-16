var testing_pokedex = function() {
    return [
        {name:"Abbra",
         img:"http://web.centre.edu/michael.bradshaw/catchem/abra.png",
         description:"Magic Cat?",
         cool:true	 
        },
        {name:"Bee Drill",
         img:"http://web.centre.edu/michael.bradshaw/catchem/beedrill.png",
         description:"Ackward Bee",
         cool:true	
        },
        {name:"Rattata",
         img:"http://web.centre.edu/michael.bradshaw/catchem/rattata.png",
         description:"Only thing I ever get in pokemon.",
         cool:false	 
        }
    ];
};



describe('Pokemon tests',function()
{

    var baseURL = "http://localhost:8081/";
    var addURL = baseURL+"#!/addPokemon";
    var server = require("../test_server.js");




    xdescribe('on start of test',function()
    {

        beforeEach(function()
        {
            browser.get(baseURL);
        });


        it("will have a button for coolness",function()
        {
            var coolB = element(by.id("coolButton"));
            expect(coolB).toBeDefined();
            expect(coolB.getText())
            .toEqual("Toggle Coolness");

        });


        it("coolness button will toggle the title",function()
        {
            var coolB = element(by.id("coolButton"));
            var cool = element(by.id("showCool"));
            var notCool = element(by.id("showNotCool"));


            expect(cool.isDisplayed()).toBeTruthy();
            expect(notCool.isDisplayed()).toBeFalsy();

            coolB.click();

            expect(cool.isDisplayed()).toBeFalsy();
            expect(notCool.isDisplayed()).toBeTruthy();

        });


        it("should have no pokemon present",function()
        {
            var pokes = element.all(by.repeater("monster in pokedex"));

            expect(pokes.count()).toEqual(0);
            var coolB = element(by.id("coolButton"));
            coolB.click();

            expect(pokes.count()).toEqual(0);
        });




        it("will have a button for adding",function()
        {
            var addB = element(by.id("addButton"));
            expect(addB).toBeDefined();
            expect(addB.getText())
            .toEqual("ADD Pokemon");

        });


        it("when I click the button for adding, I will go to another screen",function()
        {
            var addB = element(by.id("addButton"));
            addB.click();
            expect(browser.getCurrentUrl()).toEqual(addURL);


        });



    });

    describe("The Add Pokemon Page",function()
    {


    beforeEach(function()
    {
        browser.get(addURL);
    });


    it("can let me go back with a button",function()
    {
        var backB = element(by.id("returnButton"));
        backB.click();
        expect(browser.getCurrentUrl()).toEqual(baseURL+"#!/");
    });



    it("can let me go back with a link",function()
    {
        var backL = element(by.css("a"));
        backL.click();
        expect(browser.getCurrentUrl()).toEqual(baseURL+"#!/");
    });





    addPok = function(poke)
    {

    it("can add "+poke.name,function()
    {

        var name = element(by.model("monster.name"));    
        var nameT = element(by.css("h1"));

        name.clear();
        name.sendKeys(poke.name);

        //nameT.getText().then(function(text) { console.log(text); });
        expect(nameT.getText()).toEqual(poke.name);



        var desc = element(by.model("monster.description"));    
        var descT = element(by.css("p"));

        desc.clear();
        desc.sendKeys(poke.description);

        //nameT.getText().then(function(text) { console.log(text); });
        expect(descT.getText()).toEqual(poke.description);



        var img = element(by.model("monster.img"));    
        var imgT = element(by.css("img"));

        img.clear();
        img.sendKeys(poke.img);

        //nameT.getText().then(function(text) { console.log(text); });
        expect(imgT.getAttribute("src")).toEqual(poke.img);


        var addB = element(by.id("addButton"));
        addB.click();
        expect(browser.getCurrentUrl()).toEqual(baseURL+"#!/");





    });
    };

    testing_pokedex().forEach(addPok);


    });


    describe("after adding I can view Pokemon",function()
    {
        var pokes;

    beforeEach(function()
    {
        browser.get(baseURL);
        pokes = element.all(by.repeater("monster in pokedex"));   
    });


    it("should have all the pokemon",function()
    {
        expect(pokes.count()).toEqual(testing_pokedex().length);
    });

    var checkPoke = function(poke)
    {

    it("should contain "+poke.name,function()
    {

        var found = false;
        pokes.then(function(arr)
               {
               arr.forEach(function(elem)
                       {
                       if(! found)
                           {
                       var summary = elem.element(by.css(".name"));
                       summary.getText()
                           .then(function(n)
                             {
                             if(n == poke.name)
                             {

                                 var img = elem.element(by.css("img"));
                                 expect(img.getAttribute("src")).toEqual(poke.img);

                                 //summary.click();
                                 found=true;


                             }
    //						 console.log("n: |"+n+"|"+poke.name+"|"+found);

                             });
                           }

                       });
               })
        .then(function() {
        expect(found).toBeTruthy();//has to be done after the promise...
        });


    });

    };

    testing_pokedex().forEach(checkPoke);


    var checkPoke2 = function(poke)
    {

    it("should contain "+poke.name,function()
    {
    //    var selector = "a[href='"+baseURL+"#!/pokemon/"+poke.name+"']";
        var selector = "a[href='#!/pokemon/"+poke.name+"']";
        console.log(selector);
        var summary = element(by.css(selector));
        var name = summary.element(by.css(".name"));    

        expect(name.getText()).toEqual(poke.name);

        var img = summary.element(by.css("img"));
        expect(img.getAttribute("src")).toEqual(poke.img);

        summary.click(); //check the link...

        var nameT = element(by.css("h1"));
        var descT = element(by.css("p"));
        var imgT = element(by.css("img"));

        expect(nameT.getText()).toEqual(poke.name);
        expect(descT.getText()).toEqual(poke.description);
        expect(imgT.getAttribute("src")).toEqual(poke.img);


    });

    };

    testing_pokedex().forEach(checkPoke2);







    var checkDetail = function(poke)
    {

    it("should have a detail page for "+poke.name,function()
    {

        browser.get(baseURL+"#!/pokemon/"+poke.name);

        //should take me to detail page...
        var nameT = element(by.css("h1"));
        var descT = element(by.css("p"));
        var imgT = element(by.css("img"));

        expect(nameT.getText()).toEqual(poke.name);
        expect(descT.getText()).toEqual(poke.description);
        expect(imgT.getAttribute("src")).toEqual(poke.img);



    });

    //testing_pokedex().forEach(checkDetail);


    }


    });//describe





});