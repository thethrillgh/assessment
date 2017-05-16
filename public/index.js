(function () {

    angular.module("assessment", ['angularBootstrapNavTree', 'ngAnimate', 'ngQuill', 'ui.router', 'ngFileUpload']);

    var genService = function ($http) {
        var getDepartments = function (){
            return $http.get('/departments');
        }
        var currentDpt = function (){
            return $http.get('/dpt');
        }
        var getAssessments = function(){
            return $http.get('/assessments')
        }
        var logout = function(){
            return $http.get('/logout')
        }
        var updateMission = function(data){
            return $http.put('/missionStatement', data)
        }
        var updateGoal = function(data){
            return $http.put('/goal', data)
        }
        var updateSLO = function(data){
            return $http.put('/slo', data)
        }
        var updateTool = function(data){
            return $http.put('/process', data)
        }
        var updateResult = function(data){
            return $http.put('/result', data)
        }
        var createGoal = function(data){
            return $http.post('/goal', data)
        }
        var createSLO = function(data){
            return $http.post('/slo', data)
        }
        var createTool = function(data){
            return $http.post('/process', data)
        }
        
        var oldData = {
            currentBranch: {
                label: "Mission Statement",
                data: ""
            },
            department: "Computer Science",
            user: "",
            changedGoal: false,
            changedSLO: false,
            report: [{
                label: "Mission Statement",
                data: {
                    info: "The Computer Science Program seeks to produce graduates who are able to research and analyze complex problems and then to design and implement appropriate computational solutions for them. The program aims to produce liberally educated graduates with the communication skills and broad technical and social understanding appropriate to a discipline that relates to nearly every aspect of modern life. The program seeks to provide opportunities for students to gain practical experience in applying what they have learned to real-world situations and to prepare students for graduate school or computer science-related positions in industry.",
                    type: "mission"
                },
                children: [{
                        label: "Goal 1",
                        data: {
                            info: "possesses the core content knowledge of the discipline as well as an awareness of the ethical and social implications of computing technology.",
                            type: "goal"
                        },
                        children: [{
                            label: "SLO1",
                            data: {
                                info: "possesses the core content knowledge of the discipline as well as an awareness of the ethical and social implications of computing technology.",
                                type: "slo"
                            },
                            children: [{
                                    label: "Tool 1",
                                    data: {
                                        info: "We use several tools for measuring students’ knowledge in the core curriculum. The ETS exam gives us a method of evaluating our students’ knowledge of the core curriculum (except for the social and ethical issues) and of comparing their performance to a larger group.  Secondly, using an online anonymous survey, we ask the seniors to reflect on how much they have learned during their course of study to gauge their confidence in their preparation. (This includes a question on the social and ethical issues.)  The alumni evaluation of their experience in the computer science program is also relevant here.",
                                        type: "tool"
                                    },
                                    children: [{
                                        label: "Result",
                                        data: {
                                            info: "possesses the core content knowledge of the discipline as well as an awareness of the ethical and social implications of computing technology.",
                                            type: "result"
                                        }
                                    }]
                                }
                            ]
                        }]
                    }
                ]
            }]
        };
        var login = function (data) {
            return $http.post("/signin", data)
        }
        return {
            getDepartments: getDepartments,
            currentDpt: currentDpt,
            getAssessments: getAssessments,
            data: oldData,
            login: login,
            logout: logout,
            updateMission: updateMission,
            updateGoal: updateGoal,
            updateSLO: updateSLO,
            updateTool: updateTool,
            updateResult: updateResult,
            createGoal: createGoal,
            createTool: createTool,
            createSLO: createSLO
        }
    };


    //Controllers
    var mainController = function ($scope, genService, Upload, $state, info, currentdpt) {
        var tree = $scope.my_tree = {};
        $scope.dpt = currentdpt.data;
//        $scope.dpt = $state.params.obj;
        $scope.logout = function(){
            genService.logout()
        } 
        $scope.missionStatement = info.data.data.evaluations[0].evaluation.data.info;
        $scope.editorCreated = function(editor){
            var text = $scope.missionStatement || "<h1>Hello World</h1>"
            editor.clipboard.dangerouslyPasteHTML(text);
        }
        $scope.editorCreatedGoal = function(editor){
            var text = $scope.goal || "<h1>Hello World</h1>"
            editor.clipboard.dangerouslyPasteHTML(text);
        }
        $scope.editorCreatedSlo = function(editor){
            var text = $scope.slo || "<h1>Hello World</h1>"
            editor.clipboard.dangerouslyPasteHTML(text);
        }
        $scope.editorCreatedTool = function(editor){
            var text = $scope.tool || "<h1>Hello World</h1>"
            editor.clipboard.dangerouslyPasteHTML(text);
        }
        $scope.editorCreatedResult = function(editor){
            var text = $scope.result || "<h1>Hello World</h1>"
            editor.clipboard.dangerouslyPasteHTML(text);
        }
//        console.log(info.data.data.evaluations[0]);
        $scope.saveText = function(data, type, name){
            var selectBranch = tree.get_selected_branch();
            if(type == "mission"){
                genService.updateMission(
                    {
                        missionStatement: data,
                        assessmentId: info.data.data.evaluations[0]._id
                    }
                ).then(function(data){
                    console.log(data)
                    if(data.data.success){
                        $state.reload();
                    }
                })
            }
            else if(type == "goal"){
                genService.updateGoal(
                    {
                        goal: data,
                        goalName: name,
                        assessmentId: info.data.data.evaluations[0]._id,
                        goalId: selectBranch._id
                    }
                ).then(function(data){
                    if(data.data.success){
                        $state.reload();
                    }
                })
            }
            else if(type == "slo"){
                var branch = tree.get_parent_branch(selectBranch);
                genService.updateSLO(
                    {
                        updatedSLO: data,
                        sloName: name,
                        assessmentId: info.data.data.evaluations[0]._id,
                        goalId: branch._id,
                        sloId: selectBranch._id
                    }
                ).then(function(data){
                    console.log(data)
                    if(data.data.success){
                        $state.reload();
                    }
                })
            }
            else if(type == "tool"){
                var branch = tree.get_parent_branch(selectBranch);
                var parentBranch = tree.get_parent_branch(branch);
                genService.updateTool(
                    {
                        updatedProcess: data,
                        processName: name,
                        assessmentId: info.data.data.evaluations[0]._id,
                        sloId: branch._id,
                        processId: selectBranch._id,
                        goalId: parentBranch._id
                    }
                ).then(function(data){
                    console.log(data)
                    if(data.data.success){
                        $state.reload();
                    }
                })
            }
            else if(type == "result"){
                var branch = tree.get_parent_branch(selectBranch);
                var parentBranch = tree.get_parent_branch(branch);
                var parentParentBranch = tree.get_parent_branch(parentBranch);
                genService.updateResult(
                    {
                        updatedResult: data,
                        resultName: name,
                        assessmentId: info.data.data.evaluations[0]._id,
                        sloId: parentBranch._id,
                        processId: branch._id,
                        goalId: parentParentBranch._id
                    }
                ).then(function(data){
                    console.log(data)
                    if(data.data.success){
                        $state.reload();
                    }
                })
            }
        }
        function branchInitialize(type, branch) {
            $state.go("home." + type);
        }
        $scope.tree_handler = function (branch) {
            console.log(branch.data);
            if (branch.label == "Mission Statement") {
                branchInitialize("mission", branch)
            } else if (branch.data.type_ == "goal") {
                $scope.missionData = tree.get_parent_branch(branch).data.info;
                $scope.goal = branch.data.info;
                $scope.goalName = branch.label;
                branchInitialize("goal", branch);
            } else if (branch.data.type_ == "slo") {
                console.log(branch)
                $scope.goalData = tree.get_parent_branch(branch).data.info;
                $scope.sloName = branch.label;
                $scope.slo = branch.data.info;
                branchInitialize("slo", branch);

            } else if (branch.data.type_ == "process" || branch.label=="Process") {
                $scope.sloData = tree.get_parent_branch(branch).data.info;
                $scope.tool = branch.data.info;
                $scope.toolName = branch.label;
                branchInitialize("tool", branch);
            } else if (branch.data.type_ == "result"){
                $scope.toolData = tree.get_parent_branch(branch).data.info;
                $scope.result = branch.data.info;
                $scope.resultName = branch.label;
                branchInitialize("result", branch);
            }
        }
        $scope.treedata_avm = [info.data.data.evaluations[0].evaluation] || genService.data.report;
        
        $scope.add_branch = function(type){
            var selectBranch = tree.get_selected_branch();
            var parentBranch = tree.get_parent_branch(selectBranch);
            var b;
            b = tree.get_selected_branch();
            if(type=="goal"){
                genService.createGoal({assessmentId: info.data.data.evaluations[0]._id}).then(function(data){
                    console.log(data)
                    if(data.data.success){
                        $state.reload()
                    }
                })
            }
            else if(type=="slo"){
                genService.createSLO({assessmentId: info.data.data.evaluations[0]._id, goalId: selectBranch._id}).then(function(data){
                    console.log(data)
                    if(data.data.success){
                        $state.reload()
                    }
                })
                
            } 
            else if(type=="tool"){
                genService.createTool({assessmentId: info.data.data.evaluations[0]._id, goalId: parentBranch._id, sloId: selectBranch._id}).then(function(data){
                    console.log(data)
                    if(data.data.success){
                        $state.reload()
                    }
                })
                
            }            
        };
    }

    var loginController = function ($scope, $http, genService, departments, $state) {
        // Display list of departments
        $scope.departments = departments.data.data.departments;
        
        //Verify password
        $scope.signin = function () {
              genService.login({
                  department: $scope.department,
                  password: $scope.password
              }).then(function (data) {
                  if(data.data.success){
                      $state.go('home', {obj: $scope.department});
                  }
                  else{
                      $state.reload()                      
                  }
              });
        };

    }

    // Routing
    var routingConfig = function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'login.html',
                controller: "loginController",
                resolve: {
                    departments: function(genService){
                        return genService.getDepartments();
                    }
                }
            })
            .state('home', {
                url: '/home',
                params: {
                  obj: null
                },
                templateUrl: 'ngviews/home.html',
                controller: "mainController",
                resolve: {
                    info: function(genService){
                        return genService.getAssessments();
                    },
                    currentdpt: function(genService){
                        return genService.currentDpt();
                    }
                }
            })
            .state('home.mission', {
                url: '/mission',
                params: {
                  obj: null
                },
                templateUrl: 'ngviews/mission-view.html'
            })
            .state('home.goal', {
                url: '/goal',
                templateUrl: 'ngviews/goal-view.html'
            })
            .state('home.slo', {
                url: '/slo',
                templateUrl: 'ngviews/slo-view.html'
            })
            .state('home.tool', {
                url: '/tool',
                templateUrl: 'ngviews/tool-view.html'
            })
            .state('home.result', {
                url: '/result',
                templateUrl: 'ngviews/results-view.html'
            });
        $urlRouterProvider.otherwise('/404');
        $urlRouterProvider.when('', '/login');
    }


    // Directives
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
    var missionDirective = function () {
        return {
            templateUrl: 'directives/missionDirective.html'
        };
    };

    angular
        .module("assessment")
        .controller("mainController", mainController)
        .controller("loginController", loginController)
        .service("genService", genService)
        .config(['ngQuillConfigProvider', function (ngQuillConfigProvider) {
            ngQuillConfigProvider.set(null, null, 'custom placeholder')
        }])
        .directive("apDirective", apDirective)
        .directive("resultsDirective", resultsDirective)
        .directive("sloDirective", sloDirective)
        .directive("assessmentDirective", assessmentDirective)
        .directive("toolDirective", toolDirective)
        .directive("missionDirective", missionDirective)
        .directive("goalDirective", goalDirective)
        .config(routingConfig)
        .filter('trustedhtml', 
           function($sce) { 
              return $sce.trustAsHtml; 
           }
        );



})
();