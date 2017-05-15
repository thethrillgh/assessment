(function () {

    angular.module("assessment", ['angularBootstrapNavTree', 'ngAnimate', 'ngQuill', 'ui.router', 'ngFileUpload']);

    var genService = function ($http) {
        var getDepartments = function () {
            return $http.get('/departments');
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
                                },
                                {
                                    label: "Tool 2",
                                    data: {
                                        info: "possesses the core content knowledge of the discipline as well as an awareness of the ethical and social implications of computing technology.",
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
                    },
                    {
                        label: "Goal 2",
                        data: {
                            info: "possesses the core content knowledge of the discipline as well as an awareness of the ethical and social implications of computing technology.",
                            type: "goal"
                        },
                        children: [{
                            label: "SLO2",
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
                                },
                                {
                                    label: "Tool 2",
                                    data: {
                                        info: "possesses the core content knowledge of the discipline as well as an awareness of the ethical and social implications of computing technology.",
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
            data: oldData,
            login: login
        }
    };


    //Controllers
    var mainController = function ($scope, genService, $sce, Upload, $state) {
        var tree = $scope.my_tree = {};

        function branchInitialize(type, branch) {
            $state.go("home." + type);
        }
        $scope.tree_handler = function (branch) {
            if (branch.data.type == "mission") {
                branchInitialize("mission", branch)
            } else if (branch.data.type == "goal") {
                $scope.missionData = branch.data.info;
                branchInitialize("goal", branch)
            } else if (branch.data.type == "slo") {
                $scope.goalData = branch.data.info;
                branchInitialize("slo", branch);

            } else if (branch.data.type == "tool") {
                $scope.sloData = branch.data.info;
                branchInitialize("tool", branch);
            } else if (branch.data.type == "result") {
                $scope.toolData = branch.data.info;
                branchInitialize("result", branch);
            }
        }
        $scope.message = $sce.trustAsHtml($scope.message);

        $scope.treedata_avm = genService.data.report;

        $scope.add_branch = function () {
            var b;
            b = tree.get_selected_branch();
            console.log(b)
            var obj;
            genService.data.report[0].children.forEach(function (item) {
                console.log(item)
                if (item.uid == b.uid) {
                    if (item.data.type == "goal") {
                        obj = {
                            label: "New SLO",
                            data: {
                                info: "",
                                type: "slo"
                            },
                            children: []
                        }
                    } else if (item.data.type == "slo") {
                        obj = {
                            label: "New Tool",
                            data: {
                                info: "",
                                type: "tool"
                            },
                            children: []
                        }
                    } else if (item.data.type == "tool") {
                        obj = {
                            label: "New Result",
                            data: {
                                info: "",
                                type: "result"
                            },
                            children: []
                        }
                    }
                }
            })
            return tree.add_branch(b, obj);
        };
    }

    var loginController = function ($scope, $http, genService) {
        // Display list of departments
        genService.getDepartments().then(function (data) {
            if (data.success) {
                $scope.departments = data.departments;
            };
        });
        $scope.departments = [
             {
                "_id": "590f3c7fcc68a006c8eceada",
                "department": "Music",
                "__v": 0,
                "id": "590f3c7fcc68a006c8eceada"
              },
              {
                "_id": "590f3c7fcc68a006c8eceadb",
                "department": "Philosophy",
                "__v": 0,
                "id": "590f3c7fcc68a006c8eceadb"
              }
        ]
        //Verify password
        $scope.signin = function () {
              genService.login({
                  department: $scope.department,
                  password: $scope.password
              }).then(function (data) {
                  if (data.success) {
                      $http.redirectTo('/home');
                  } else {
                      var msg = data.message;
                      alert(msg);
                      //Do something with the error message
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
                controller: "loginController"
            })
            .state('home', {
                url: '/home',
                templateUrl: 'ngviews/home.html',
                controller: "mainController"
            })
            .state('home.mission', {
                url: '/mission',
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
        .config(routingConfig);



})
();