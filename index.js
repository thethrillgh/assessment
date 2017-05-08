( function()
{
    angular.module("assessment", ['angularBootstrapNavTree', 'ngAnimate', 'ngQuill', 'ngRoute', 'ngFileUpload']);
    var genService = function(){
        return {
            department: "Computer Science",
            user: "",
            changedGoal: false,
            changedSLO: false,
            report: [
                {
                    label: "Mission Statement",
                    data: {
                        info: "The Computer Science Program seeks to produce graduates who are able to research and analyze complex problems and then to design and implement appropriate computational solutions for them. The program aims to produce liberally educated graduates with the communication skills and broad technical and social understanding appropriate to a discipline that relates to nearly every aspect of modern life. The program seeks to provide opportunities for students to gain practical experience in applying what they have learned to real-world situations and to prepare students for graduate school or computer science-related positions in industry.",
                        type: "mission"
                    },
                    children: [
                        {
                            label: "Goal 1",
                            data: {
                                info: "possesses the core content knowledge of the discipline as well as an awareness of the ethical and social implications of computing technology.",
                                type: "goal"
                            },
                            children: [
                                {
                                    label: "SLO1",
                                    data: {
                                        info: "possesses the core content knowledge of the discipline as well as an awareness of the ethical and social implications of computing technology.",
                                        type: "slo"
                                    },
                                    children: [
                                        {
                                            label: "Tool 1",
                                            data: {
                                                info: "We use several tools for measuring students’ knowledge in the core curriculum. The ETS exam gives us a method of evaluating our students’ knowledge of the core curriculum (except for the social and ethical issues) and of comparing their performance to a larger group.  Secondly, using an online anonymous survey, we ask the seniors to reflect on how much they have learned during their course of study to gauge their confidence in their preparation. (This includes a question on the social and ethical issues.)  The alumni evaluation of their experience in the computer science program is also relevant here.",
                                                type: "tool"
                                            },
                                            children: [
                                                {
                                                    label: "Result",
                                                    data: {
                                                        info: "possesses the core content knowledge of the discipline as well as an awareness of the ethical and social implications of computing technology.",
                                                        type: "result"
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            label: "Tool 2",
                                            data: {
                                                info: "possesses the core content knowledge of the discipline as well as an awareness of the ethical and social implications of computing technology.",
                                                type: "tool"
                                            },
                                            children: [
                                                {
                                                    label: "Result",
                                                    data: {
                                                        info: "possesses the core content knowledge of the discipline as well as an awareness of the ethical and social implications of computing technology.",
                                                        type: "result"
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    };


    var mainController = function($scope, genService, $sce, Upload){
        
        var tree = $scope.my_tree = {};
        console.log(tree);
        $scope.goalHide = true;
        $scope.sloHide = true;
        $scope.toolHide = true;
        $scope.resultHide = true;
        $scope.missionHide = true;
        $scope.tree_handler = function(branch){
            if(branch.data.type == "mission"){
                $scope.goalHide = true;
                $scope.sloHide = true;
                $scope.toolHide = true;
                $scope.resultHide = true;
                $scope.missionHide = true;
            }
            if(branch.data.type == "goal"){
                $scope.missionHide = false;
                $scope.goalHide = true;
                $scope.missionData = branch.data.info;
            }
            else if(branch.data.type == "slo"){
                $scope.missionHide = true;
                $scope.goalHide = false;
                $scope.sloHide = true;
                $scope.goalData = branch.data.info;
                
            }
            else if(branch.data.type == "tool"){
                $scope.goalHide = false;
                $scope.sloHide = false;
                $scope.toolHide = true;
                $scope.sloData = branch.data.info;
            }
            else if(branch.data.type == "result"){
                $scope.goalHide = false;
                $scope.sloHide = false;
                $scope.toolHide = false;
                $scope.toolData = branch.data.info;
            }
        }
        $scope.message = $sce.trustAsHtml($scope.message);
        $scope.treedata_avm = genService.report;
        $scope.add_branch = function() {
          var b;
          b = tree.get_selected_branch();
          return tree.add_branch(b, {
            label: 'New Branch',
            data: {
              something: 42,
              "else": 43
            }
          });
        };
    }
    
    var treeView =  function($scope, $routeParams, $location){
        
    }
    
    var routingConfig = function($routeProvider){
        $routeProvider
        .when("/", {
            templateUrl: "mission.html"
        })
        .when("/goal", {
            templateUrl: "goal.html",
            controller: "goalController"
        })
        .otherwise({redirectTo: "/bad.html"})
    }


    var sloDirective = function () {
		return {
			templateUrl: 'directives/sloDirective.html'
		};
	};
    var goalDirective = function () {
		return {
			templateUrl: 'directives/goalDirective.html'
		};
	};
    var toolDirective = function () {
		return {
			templateUrl: 'directives/toolDir.html'
		};
	};  
    var assessmentDirective = function () {
		return {
			templateUrl: 'directives/assessmentDir.html'
		};
	};
    var resultsDirective = function () {
		return {
			templateUrl: 'directives/resultsDirective.html'
		};
	};
     var apDirective = function () {
		return {
			templateUrl: 'directives/actionplanDirective.html'
		};
	};
    
    angular
        .module("assessment")
        .controller("mainController", mainController)
        
        .service("genService", genService)
        .config(['ngQuillConfigProvider', function(ngQuillConfigProvider){
            ngQuillConfigProvider.set(null, null, 'custom placeholder')
    
        }])
        .directive("apDirective",apDirective)
        .directive("resultsDirective",resultsDirective)
        .directive("sloDirective",sloDirective)
        .directive("assessmentDirective",assessmentDirective)
        .directive("toolDirective", toolDirective)
        .directive("goalDirective",goalDirective)
        .config(["$routeProvider", routingConfig]);

     
})
();