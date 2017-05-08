describe("Project Tests",function()
{
    var projectManager;

    beforeEach(function()
	       {
		   assessmentProject = angular.module("assessment");

    jasmine.addMatchers(
	{
	toEqualData: function(util,customeEqualityTesters)
	{
	    return{
		compare:function(actual,expected)
		{
		    return { pass:angular.equals(actual,expected) };
		}
	    };
	}
    });
 });
    
    it("module should be registered",function()
       {
	 expect( assessmentProject).toBeDefined();	   
       }
       );  
    
    
    
})